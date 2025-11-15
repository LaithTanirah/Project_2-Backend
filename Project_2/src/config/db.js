import { Sequelize } from 'sequelize';
import config from './config.js';

const env = process.env.NODE_ENV || 'production';
const dbConfig = config[env];


export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: parseInt(dbConfig.port) || 5432,
    dialect: dbConfig.dialect,
    logging: false,
    dialectOptions: dbConfig.dialectOptions || {}
  }
);