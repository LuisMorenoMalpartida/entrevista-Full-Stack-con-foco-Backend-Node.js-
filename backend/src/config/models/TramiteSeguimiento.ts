import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Tramite from './Tramite.js';

const TramiteSeguimiento = sequelize.define('TramiteSeguimiento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tramite_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tramites',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  estado_anterior: {
    type: DataTypes.ENUM('REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO'),
    allowNull: true,
  },
  estado_nuevo: {
    type: DataTypes.ENUM('REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO'),
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'operador',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tramite_seguimiento',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['tramite_id'] },
  ],
});

TramiteSeguimiento.belongsTo(Tramite, { foreignKey: 'tramite_id', as: 'tramite' });
Tramite.hasMany(TramiteSeguimiento, { foreignKey: 'tramite_id', as: 'seguimientos' });

export default TramiteSeguimiento;
