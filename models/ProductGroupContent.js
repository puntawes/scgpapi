module.exports = (sequelize, DataTypes) => {
    const ProductGroupContent = sequelize.define(
        "ProductGroupContent",
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
            tableName: "product_group_content",
            underscored: true,
            timestamps: false
        }
    );

    return ProductGroupContent;
};