module.exports = (sequelize, DataTypes) => {
    const PopupContent = sequelize.define(
        "PopupContent",
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
            contentTitle: DataTypes.STRING,
            contentDatetimeStart: DataTypes.DATE,
            contentDatetimeEnd: DataTypes.DATE,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            contentStatus: DataTypes.ENUM('deleted','pending','active'),
        },
        {
            tableName: "popup_content",
            underscored: true,
            timestamps: false
        }
    );

    PopupContent.associate = function (models) {
        PopupContent.hasMany(models.PopupAttachment, { foreignKey: 'default_main_id' })
    };

    return PopupContent;
};