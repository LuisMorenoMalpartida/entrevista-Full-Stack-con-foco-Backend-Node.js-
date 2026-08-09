import sequelize from '../database.js';
import Cliente from './Cliente.js';
import Tramite from './Tramite.js';
import TramiteSeguimiento from './TramiteSeguimiento.js';

const models = {
  sequelize,
  Cliente,
  Tramite,
  TramiteSeguimiento,
};

export default models;
