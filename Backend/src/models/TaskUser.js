const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Task = require("./Task");
const User = require("./User");

const TaskUser = sequelize.define("TaskUser", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Task,
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Relacionar tareas con usuarios
Task.belongsToMany(User, { through: TaskUser, foreignKey: "task_id" });
User.belongsToMany(Task, { through: TaskUser, foreignKey: "user_id" });

module.exports = TaskUser;
