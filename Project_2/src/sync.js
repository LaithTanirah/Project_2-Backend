import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataTypes } from 'sequelize';
import { sequelize } from './config/db.js';
import  initModels  from './sequelize-models/init-models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

initModels(sequelize, DataTypes);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Failed to sync models:', error);
  }
})();