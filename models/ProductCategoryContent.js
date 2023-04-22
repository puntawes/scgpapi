module.exports = (sequelize, DataTypes) => {
    const ProductCategoryContent = sequelize.define(
        "ProductCategoryContent",
        {
            contentId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            mainId: {
                type: DataTypes.INTEGER,
            },
            langId: {
                type: DataTypes.STRING,
            },
            contentType: DataTypes.ENUM('product','services'),
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
            tableName: "product_category_content",
            underscored: true,
            timestamps: false
        }
    );


    return ProductCategoryContent;
};