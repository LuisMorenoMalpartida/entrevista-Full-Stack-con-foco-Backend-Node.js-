import sequelize from '../database.js';

const Cliente = sequelize.define('Cliente', {}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Cliente;
