const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Project = require('./Project');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  start_date: { type: DataTypes.DATE },
  due_date: { type: DataTypes.DATE },
  priority: { type: DataTypes.STRING, defaultValue: 'Media' },
  status: { type: DataTypes.STRING, defaultValue: 'Pendiente' },
  project_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Project, key: 'id' } }
});

module.exports = Task;
