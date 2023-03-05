import * as dotenv from 'dotenv';

import {
  App,
  MongoDB,
  Environments,
} from './constants';

dotenv.config();

export default () => {
  return {
    serviceName: process.env.APP_NAME || App.NAME,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : App.PORT,
    mongoUser: process.env.MONGO_USERNAME || MongoDB.USER_NAME,
    mongoPassword: process.env.MONGO_PASSWORD || MongoDB.PASSWORD,
    mongoProtocol: process.env.MONGO_PROTOCOL || MongoDB.PROTOCOL,
    dbName: process.env.DB_NAME || MongoDB.NAME,
    mongoHost: process.env.MONGO_HOST || MongoDB.HOST,
    mongoRequestParams: MongoDB.REQUEST_PARAMS,
    environment: process.env.ENV || Environments.DEV
  };
};
