import { NextFunction, Request, Response } from 'express';
import { connect } from 'mongoose';

//Config
import { service_name } from '@config';

import SlackAlert from '@/https/slack';

//DB conncection
import { MONGO_CONNECTION_INSTANCES } from '@databases';
const dbConnection = MONGO_CONNECTION_INSTANCES['dukandar_aadhar'];

class IndexController {
  private slackAlert = new SlackAlert();
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!dbConnection || dbConnection.readyState !== 1) {
        this.slackAlert.slackAtNuShopProdErrors(`Mongo health check failed: ${service_name}`);
        return res.status(500).json({ message: 'Cannot connect to db' });
      }
      return res.status(200).json({ service: service_name });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
