module.exports = (sequelize, DataTypes) => {
    const ProductSubCategoryContent = sequelize.define(
        "ProductSubCategoryContent",
        {
            contentId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            mainId: {
                type: DataTypes.INTEGER,
            },
            categoryId: {
                type: DataTypes.INTEGER,
            },
            langId: {
                type: DataTypes.STRING,
            },
            contentSubject: DataTypes.STRING,
            contentShortdesc: DataTypes.STRING,
            contentDetail: DataTypes.STRING,
            contentThumbnail: DataTypes.STRING,
            contentExternal_link: DataTypes.STRING,
            contentTitle: DataTypes.STRING,
            contentKeyword: DataTypes.STRING,
            contentDescription: DataTypes.STRING,
            contentRewriteId: DataTypes.INTEGER,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            contentStatus: DataTypes.ENUM('deleted','pending','active'),
        },
        {
            tableName: "product_sub_category_content",
            underscored: true,
            timestamps: false
        }
    );  
    ProductSubCategoryContent.associate = function (models) {
        ProductSubCategoryContent.hasMany(models.ProductContent, { foreignKey: 'main_id',targetKey: "subCategory_id",})
        ProductSubCategoryContent.hasMany(models.SystemUrlRewrite, { foreignKey: 'url_rewrite_id'})
    };

    return ProductSubCategoryContent;
};