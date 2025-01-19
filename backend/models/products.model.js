module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    Product.associate = models => {
        Product.hasMany(models.Order, { foreignKey: "product_id", as: "orders" });
    };

    return Product;
};
