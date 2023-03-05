export const App = {
  NAME: 'cloud-statistic',
  PORT: 3001,
};

export const MongoDB = {
  NAME: 'cloud-statistic',
  USER_NAME: '',
  PASSWORD: '',
  PROTOCOL: 'mongodb',
  HOST: 'localhost:27017',
  REQUEST_PARAMS: 'retryWrites=true&w=majority'
};

export enum Environments {
  LOCAL = 'local',
  DEV = 'development',
  PROD = 'production'
}
