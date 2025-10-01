// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = sequelize.define('User', {
id: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true,
},
username: {
type: DataTypes.STRING,
allowNull: false,
unique: true,
},
email: {
type: DataTypes.STRING,
allowNull: false,
unique: true,
validate: { isEmail: true },
},
password: {
type: DataTypes.STRING,
allowNull: false,
},
role: {
type: DataTypes.ENUM('admin', 'user'),
allowNull: false,
defaultValue: 'user',
},
}, {
tableName: 'users',
timestamps: true,
});
// Remove password from JSON responses
User.prototype.toJSON = function () {
const values = Object.assign({}, this.get());
delete values.password;
return values;
};
module.exports = User;