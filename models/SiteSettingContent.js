module.exports = (sequelize, DataTypes) => {
    const SiteSettingContent = sequelize.define(
        "SiteSettingContent",
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
            contentWebName: {
                type: DataTypes.STRING,
            },
            contentAddress: {
                type: DataTypes.STRING,
            },
            contentGganalyticsTrackingId: {
                type: DataTypes.STRING,
            },
            contentGganalyticsTrackingCode: {
                type: DataTypes.STRING,
            },
            contentGganalyticsTrackingStatus: {
                type: DataTypes.ENUM('enable','disable'),
            },
            contentGgadsTrackingId: {
                type: DataTypes.STRING,
            },
            contentGgadsTrackingCode: {
                type: DataTypes.STRING,
            },
            contentGgadsTrackingStatus: {
                type: DataTypes.ENUM('enable','disable'),
            },
            contentTitle: {
                type: DataTypes.STRING,
            },
            contentKeyword: {
                type: DataTypes.STRING,
            },
            contentDescription: {
                type: DataTypes.STRING,
            },
            postBy: DataTypes.INTEGER,
            postDate: DataTypes.DATE,
            postIp: DataTypes.STRING,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            contentStatus: DataTypes.ENUM('deleted','pending','active'),
        },
        {
            tableName: "site_settings_content",
            underscored: true,
            timestamps: false,
            paranoid: true,

        }
    );
    


    return SiteSettingContent;
};