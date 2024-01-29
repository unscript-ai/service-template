// Modules
import mongoose from 'mongoose';

// Config
import { database } from '@config';
import { IDatabaseConnection } from '@/typings/config';

const DATABASE_CONFIG = database;

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  mongoose.set('debug', true);
}

const MONGO_DBS = ['erp_users'];

const mongoConnectionInstances = {};

/**
 * returns db path for mongoose to connect to
 * @param dbConfig
 * @returns {string}
 */
const getConnectionURL = (dbConfig: IDatabaseConnection): string =>
  `${dbConfig.client}://${[`${dbConfig.connection.host}:${dbConfig.connection.port}`].join(',')}/${dbConfig.connection.name}`;

/**
 * returns db connection
 * @returns {*}
 * @param dbConfig
 * @param options
 */
const getDBConnection = (dbConfig: IDatabaseConnection) =>
  mongoose.createConnection(getConnectionURL(dbConfig), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // ...options,
  });

/**
 * initializes connection instances
 * @private
 */
export const _initializeMongoConnections = () => {
  MONGO_DBS.forEach(dbName => {
    const dbConfig = DATABASE_CONFIG[dbName] as IDatabaseConnection;

    if (!dbConfig) {
      throw new Error('Database not supported');
    }

    // const options = isProduction
    //   ? {
    //       readPreference: 'secondaryPreferred',
    //       replicaSet: dbConfig.replset_name,
    //     }
    //   : {};

    mongoConnectionInstances[dbName] = getDBConnection(dbConfig);
    // mongoConnectionInstances[dbName] = getDBConnection(dbConfig, options);
  });
};

_initializeMongoConnections();

export const MONGO_CONNECTION_INSTANCES = mongoConnectionInstances;
