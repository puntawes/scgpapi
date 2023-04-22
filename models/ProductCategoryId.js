module.exports = (sequelize, DataTypes) => {
    const ProductCategoryId = sequelize.define(
        "ProductCategoryId",
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
            tableName: "product_category_id",
            underscored: true,
            timestamps: false
        }
    );


    ProductCategoryId.associate = function (models) {
        ProductCategoryId.hasMany(models.ProductCategoryContent, { foreignKey: 'main_id' })
    };

    return ProductCategoryId;
};