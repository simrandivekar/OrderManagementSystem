module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'id'
            }
        },
        product_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'products', 
                key: 'id'
            }
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    // Associations
    Order.associate = models => {
        Order.belongsTo(models.User, { foreignKey: "user_id", as: "user" });  // Alias 'user'
        Order.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });  // Alias 'product'
    };

    return Order;
};
