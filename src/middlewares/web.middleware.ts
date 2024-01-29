import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';

//models
import userModel from '@models/users.model';

//helpers and utils
import { JWT } from '@/helpers/jwt';
import { getAuthTokenFromRequest, getHashKeyForJWT, setKey, getKey } from '@utils/util';

//constants
import { PLATFORMS } from '@/constants/common';

// DAO
import UserDao from '@/dao/users.dao';

export class WebAuthentication {
  private jwt = new JWT();
  private userDao = new UserDao();

  public getUserFromCacheIfExists = async (hash: any): Promise<any> => {
    const stringifiedUserData = await getKey(hash);
    return stringifiedUserData ? JSON.parse(stringifiedUserData) : undefined;
  };

  public setUserInReq = async (req, res, next) => {
    const { wm_platform: platform } = req.headers;
    const jwtToken = getAuthTokenFromRequest(req);
    try {
      if (!jwtToken) {
        throw new Error('Auth token not found.');
      }
      const decode = this.jwt.validateWebJwt(jwtToken);
      const contactNumber = decode.contact_number;

      const hashCode = getHashKeyForJWT(jwtToken); // for caching
      let user = await this.getUserFromCacheIfExists(hashCode);
      if (!user) {
        let Dao;
        switch (platform) {
          case PLATFORMS.WEB: {
            Dao = this.userDao.fetchUserByWebToken;
            break;
          }
          case PLATFORMS.ANDROID: {
            Dao = this.userDao.fetchUserByAppToken;
            break;
          }
          case PLATFORMS.DASHBOARD: {
            Dao = this.userDao.fetchUserByDashboardToken;
            break;
          }
        }
        user = Dao(contactNumber, jwtToken);
        user && (await setKey(hashCode, JSON.stringify(user)));
      }
      if (!user) {
        throw new Error('Invalid token.');
      }
      req.user = user;
      next();
    } catch (err) {
      next();
    }
  };

  public checkForExternalDomain = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const host = req.headers.wm_seller_website;

      if (!host) return next();

      req['isExternalDomain'] = ['nushop.store', 'nushop.kaip.in', 'nushop-qa.kaip.in'].every(domain => host.indexOf(domain) === -1);
      return next();
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };

  public setSellerIdForWebInReq = async (req: any, res: Response, next: NextFunction) => {
    if (!req.headers.wm_seller_website) {
      return next();
    }

    try {
      const { isExternalDomain } = req;
      let host = req.headers.wm_seller_website; // 'john.nushop.store' or 'johnfashionstore.com' or 'www.johnfashionstore.com'
      host = isExternalDomain && host.split('.')[0].toLowerCase() === 'www' ? host.substring(4) : host;
      const urlParts = isExternalDomain ? [host] : host.split('.'); // ['johnfashionstore.com'] or ['john', 'nushop', 'store']
      const sellerWebPrefix = urlParts[0].toLowerCase(); // 'johnfashionstore.com' or 'john'

      let sellerId = await getKey(sellerWebPrefix);
      if (!sellerId) {
        const seller = isExternalDomain
          ? await userModel.findOne({ custom_domain: sellerWebPrefix }).lean()
          : await userModel.findOne({ preferred_web_prefix: sellerWebPrefix }).lean();
        if (!seller) {
          next(new HttpException(404, 'Seller Not Found'));
        } else {
          sellerId = seller._id + '';
          await setKey(sellerWebPrefix, sellerId);
        }
      }

      req['webPrefixedSellerId'] = sellerId;
      next();
    } catch (err) {
      next(new HttpException(401, 'Invalid Web Prefix for seller'));
    }
  };
}
