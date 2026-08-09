import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo_doc: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  num_doc: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ap_paterno: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ap_materno: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  fecha_nac: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['tipo_doc', 'num_doc'], unique: true },
    { fields: ['nombres'] },
  ],
});

export default Cliente;
