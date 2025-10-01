// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// إنشاء اتصال مع قاعدة بيانات PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,   // اسم قاعدة البيانات
  process.env.DB_USER,   // اسم المستخدم
  process.env.DB_PASS,   // كلمة المرور
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // خليها true إذا تريد تشوف الـ SQL queries
  }
);

module.exports = sequelize;