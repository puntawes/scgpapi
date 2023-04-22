module.exports = (sequelize, DataTypes) => {
    const SpotLightContent = sequelize.define(
        "SpotLightContent",
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
            contentYoutubeLink: DataTypes.STRING,
            contentTitle: DataTypes.STRING,
            contentKeyword: DataTypes.TEXT,
            contentDescription: DataTypes.TEXT,
            contentRewriteId: DataTypes.INTEGER,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            contentStatus: DataTypes.ENUM('deleted','pending','active'),
        },
        {
            tableName: "spotlight_content",
            underscored: true,
            timestamps: false,
            
        }
    );

    return SpotLightContent;
};