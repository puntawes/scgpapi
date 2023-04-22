module.exports = (sequelize, DataTypes) => {
    const ProductGroupId = sequelize.define(
        "ProductGroupId",
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
            tableName: "product_group_id",
            underscored: true,
            timestamps: false
        }
    );
    ProductGroupId.associate = function (models) {
        ProductGroupId.hasMany(models.ProductGroupContent, { foreignKey: 'main_id' })
        ProductGroupId.hasMany(models.ProductGroupAttachment, { foreignKey: 'default_main_id' })
    };
    return ProductGroupId;
};