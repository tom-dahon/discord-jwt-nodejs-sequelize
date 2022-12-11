const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;


// INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('1', 'user', '2022-12-11 20:24:50.000000', '2022-12-11 20:24:50.000000');
// INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('2', 'admin', '2022-12-11 20:26:04.000000', '2022-12-11 20:26:04.000000');
// INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('3', 'moderator', '2022-12-11 20:26:20.000000', '2022-12-11 20:26:20.000000');