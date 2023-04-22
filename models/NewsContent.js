module.exports = (sequelize, DataTypes) => {
    const NewsContent = sequelize.define(
        "NewsContent",
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
            contentDetail: DataTypes.TEXT,
            contentThumbnail: DataTypes.STRING,
            contentDatetime: DataTypes.DATE,
            contentYoutubeLink: DataTypes.STRING,
            contentTitle: DataTypes.STRING,
            contentKeyword: DataTypes.TEXT,
            contentDescription: DataTypes.TEXT,
            contentRewriteId: DataTypes.INTEGER,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            contentStatus: DataTypes.ENUM('deleted','pending','active'),
            contentCategory: DataTypes.STRING,
            subContentCategory: DataTypes.STRING,
        },
        {
            tableName: "news_content",
            underscored: true,
            timestamps: false,
            
        }
    );

    return NewsContent;
};