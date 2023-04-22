module.exports = (sequelize, DataTypes) => {
    const ProductId = sequelize.define(
        "ProductId",
        {
            main_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            default_main_id: {
                type: DataTypes.INTEGER,
            },
            post_by: {
                type: DataTypes.INTEGER,
            },
            post_date: DataTypes.DATE,
            post_ip: DataTypes.STRING,
            update_by: DataTypes.INTEGER,
            update_date: DataTypes.DATE,
            update_ip: DataTypes.STRING,
            main_status: DataTypes.ENUM('deleted','pending','active'),
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "product_id",
            underscored: true,
            timestamps: false
        }
    );
    ProductId.associate = function (models) {
        ProductId.hasMany(models.ProductContent, { foreignKey: 'main_id' })
        ProductId.hasMany(models.ProductAttachment, { foreignKey: 'default_main_id' })
    };
    return ProductId;
};