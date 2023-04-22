'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const serverCa = [fs.readFileSync(__dirname + "/../config/BaltimoreCyberTrustRoot.crt.pem", "utf8")];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable],{
    host:config.host,
    dialect: 'mysql',
    port:3306,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: serverCa
      }
    }});
} else {
  sequelize = new Sequelize(config.database, config.username, config.password,
    {
    host:config.host,
    dialect: 'mysql',
    port:3306,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: serverCa
      }
    }
  });
  sequelize.authenticate().then(function(errors) { if(errors){console.log(errors);} });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
