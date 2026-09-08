const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la conexión a MySQL
// Formato: new Sequelize('nombre_bd', 'usuario', 'contraseña', {...})
const sequelize = new Sequelize('graphql_db', 'root', '12312213', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Cambia a true si quieres ver las consultas SQL en la consola
});

const Usuario = sequelize.define('Usuario', {
    // Sequelize crea el campo 'id' automáticamente, pero lo definimos para mayor claridad
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pass: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false, // Desactiva createdAt y updatedAt para mantenerlo simple
    tableName: 'usuarios'
});

module.exports = { Usuario, sequelize };