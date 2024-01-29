/**
 * All your utils should stay here
 * Your util function should be pure!
 * i.e they should accept some argument, and then return some result without any side-effect
 * Further, they are not allowed to call any other functions
 */

import randomize from 'randomatic';
import { redis, service_name } from '@config';
const pawan = require('pawan');

const port = redis.port,
  serviceName = service_name,
  password = redis.password,
  host = redis.host;

export const {
  getKey,
  setKey,
  isCached,
  generateKey,
  removeKey,
  cacheFn,
  DEFAULT_EXPIRY: DEFAULT_REDIS_EXPIRY,
} = pawan(host, port, serviceName, password, {});

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const generateReferralCode: any = () => {
  return randomize('A0', 7);
};

export const createOTPMessageForWeb = (otp: Number, sellerWebsite: string): string => {
  return `${otp} - is the OTP for ${sellerWebsite} login. ECGv16vDXDa
-Blitzscale`;
};

export const createOTPMessageForAppOrDashboard = (otp: Number): string => {
  return `${otp} - is the OTP for your Nushop account. ECGv16vDXDa
-Blitzscale`;
};

export const keyMirror = (...keys) => {
  return keys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: key,
    };
  }, {});
};
