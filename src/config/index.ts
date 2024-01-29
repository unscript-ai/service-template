import nconf from 'nconf';
// typings
import { IDatabase, IDatabaseConnection, IRedis, IServer, IServices } from '@/typings/config';

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const filePath = env === 'development' ? `src/config/config.${env}.json` : `dist/config/config.${env}.json`;

nconf.argv().env().file({ file: filePath });

export const NODE_ENV: string = env;
const SERVER = nconf.get('server') as IServer;
export const PORT: number = SERVER.port;
export const LOG_FORMAT = 'combined';
export const LOG_DIR = '../logs';
export const database = nconf.get('database') as IDatabase;

export const services = (() => {
  return (nconf.get('services') as IServices) || {};
})();

export const mongoUrl = (() => {
  const db = database.erp_user as IDatabaseConnection;
  return `${db.client}://${db.connection.host}:${db.connection.port}/${db.connection.name}`;
})();

// export const webSecret = (() => {
//   return nconf.get('web_jwt').key;
// })();

// export const webJwtExpiry = (() => {
//   return nconf.get('web_jwt').expiry;
// })();

// export const sentry = nconf.get('sentry') || {};
export const service_name = nconf.get('service_name') as string;
// export const apm_service = nconf.get('apm_service');
export const redis = (nconf.get('redis') as IRedis) || {};
// export const aws = nconf.get('aws') as || {};
export const is_production = isProduction;
// export const slack = nconf.get('slack');
// export const restartAlertName = nconf.get('restart_alert_name');
