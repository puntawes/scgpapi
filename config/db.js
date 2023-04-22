const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('we_scg', 'pkgscgpweb@pkgscgpweb57', 'pkgP@ssw0rd', {
    host: 'pkgscgpweb57.mysql.database.azure.com',
    dialect: 'mysql'
});

module.exports = sequelize