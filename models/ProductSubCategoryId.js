module.exports = (sequelize, DataTypes) => {
    const ProductSubCategoryId = sequelize.define(
        "ProductSubCategoryId",
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
            tableName: "product_sub_category_id",
            underscored: true,
            timestamps: false
        }
    );


    ProductSubCategoryId.associate = function (models) {
        ProductSubCategoryId.hasMany(models.ProductSubCategoryContent, { foreignKey: 'main_id' })
        ProductSubCategoryId.hasMany(models.ProductSubCategoryAttachment, { foreignKey: 'default_main_id' })
    };

    return ProductSubCategoryId;
};