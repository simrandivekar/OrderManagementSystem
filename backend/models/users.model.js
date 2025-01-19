module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
    User.associate = (models) => {
        User.hasMany(models.Order, { foreignKey: "user_id", as: "orders" });
    };

    return User;
};
