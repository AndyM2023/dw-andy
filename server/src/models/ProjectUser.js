const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Definir ProjectUser primero
const ProjectUser = sequelize.define('ProjectUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// 🔥 Importar los modelos después de definir ProjectUser
const Project = require('./Project');
const User = require('./User');

// 🔥 Establecer relaciones después de importar los modelos
Project.belongsToMany(User, { through: ProjectUser, foreignKey: 'project_id' });
User.belongsToMany(Project, { through: ProjectUser, foreignKey: 'user_id' });

module.exports = ProjectUser;
