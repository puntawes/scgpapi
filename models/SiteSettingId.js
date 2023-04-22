module.exports = (sequelize, DataTypes) => {
    const siteSettingsId = sequelize.define(
        "siteSettingsId",
        {
            mainId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            defaultContentId: {
                type: DataTypes.INTEGER,
            },
            siteName: {
                type: DataTypes.STRING,
            },
            siteTelephone: {
                type: DataTypes.STRING,
            },
            siteMobilePhone: {
                type: DataTypes.STRING,
            },
            siteEmail: DataTypes.STRING,
            siteLine: DataTypes.STRING,
            siteInstagram: DataTypes.STRING,
            siteGooglePlus: DataTypes.STRING,
            siteYoutube: DataTypes.STRING,
            siteTwitter: DataTypes.STRING,
            siteFacebook: DataTypes.STRING,
            siteLatitude: DataTypes.DOUBLE(11, 8),
            siteLongitude: DataTypes.DOUBLE(11, 8),
            postBy: DataTypes.INTEGER,
            postDate: DataTypes.DATE,
            postIp: DataTypes.STRING,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            mainStatus: DataTypes.ENUM('deleted','pending','active'),
        },
        {
            tableName: "site_settings_id",
            underscored: true,
            timestamps: false,
            paranoid: true,

        }
    );

    siteSettingsId.associate = function (models) {
        siteSettingsId.hasMany(models.SiteSettingContent, { foreignKey: 'mainId' })
    };


    return siteSettingsId;
};