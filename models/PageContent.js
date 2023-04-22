module.exports = (sequelize, DataTypes) => {
    const PageContent = sequelize.define(
        "PageContent",
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
            contentSubject: DataTypes.STRING,
            contentShortdesc: DataTypes.STRING,
            contentDetail: DataTypes.STRING,
            contentThumbnail: DataTypes.STRING,
            contentData: DataTypes.STRING,
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
            tableName: "page_content",
            underscored: true,
            timestamps: false
        }
    );

    return PageContent;
};