const { Sequelize } = require("sequelize");

// Conexión a SQLite con Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db", // Ruta de la base de datos SQLite
  logging: false, // Desactiva logs innecesarios en la consola
});

// Probar la conexión
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a SQLite establecida correctamente.");
    await sequelize.sync();
    console.log("✅ Modelos sincronizados.");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
};

module.exports = { sequelize, connectDB };
