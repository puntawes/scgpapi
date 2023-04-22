module.exports = (sequelize, DataTypes) => {
    const ProductContent = sequelize.define(
        "ProductContent",
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
            subCategoryId: {
                type: DataTypes.INTEGER,
            },
            groupId: {
                type: DataTypes.INTEGER,
            },
            langId: {
                type: DataTypes.STRING,
            },
            contentSubject: DataTypes.STRING,
            contentShortDetail: DataTypes.STRING,
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
            tableName: "product_content",
            underscored: true,
            timestamps: false
        }
    );
    ProductContent.associate = function (models) {
        ProductContent.hasMany(models.ProductSubCategoryContent, { foreignKey: 'category_id',})
        ProductContent.hasMany(models.ProductSubCategoryId, { foreignKey: 'main_id',targetKey: "subCategory_id",})
    };
    return ProductContent;
};