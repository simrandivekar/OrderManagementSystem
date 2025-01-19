const dbconfig = require("../config/db.config.js");
const {Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbconfig.DB,dbconfig.USER,dbconfig.PASSWORD,{
    host: dbconfig.HOST,
    dialect: dbconfig.DIALECT,
    post: dbconfig.PORT
});

const db= {};

const User = require('./users.model.js')(sequelize, DataTypes);
const Product = require('./products.model.js')(sequelize, DataTypes);
const Order = require('./orders.model.js')(sequelize, DataTypes);

// Sync associations
User.associate({ Order });
Product.associate({ Order });
Order.associate({ User, Product });
sequelize.sync();

db.sequelize = sequelize;
db.Product = Product;
db.Order = Order;
db.User = User;

module.exports = db;
