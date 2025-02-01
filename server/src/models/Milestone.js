const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Project = require('./Project');

const Milestone = sequelize.define('Milestone', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  due_date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pendiente' },
  project_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Project, key: 'id' } }
});

module.exports = Milestone;
