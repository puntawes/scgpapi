module.exports = (sequelize, DataTypes) => {
    const MembersManagementContent = sequelize.define(
        "MembersManagementContent",
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
        },
        {
            tableName: "members_management_content",
            underscored: true,
            timestamps: false
        }
    );
    MembersManagementContent.associate = function (models) {
        MembersManagementContent.hasMany(models.MembersManagementAttachment, { foreignKey: 'default_main_id',targetKey: "main_id",})
    };
    return MembersManagementContent;
};