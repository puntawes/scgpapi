module.exports = (sequelize, DataTypes) => {
    const PopupId = sequelize.define(
        "PopupId",
        {
            main_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            default_main_id: {
                type: DataTypes.INTEGER,
            },
            post_by: DataTypes.INTEGER,
            post_date: DataTypes.DATE,
            post_ip: DataTypes.STRING,
            update_by: DataTypes.INTEGER,
            update_date: DataTypes.DATE,
            update_ip: DataTypes.STRING,
            main_status: DataTypes.ENUM('deleted','pending','active'),
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "popup_id",
            underscored: true,
            timestamps: false
        }
    );

    PopupId.associate = function (models) {
        PopupId.hasMany(models.PopupContent, { foreignKey: 'main_id' })
        PopupId.hasMany(models.PopupAttachment, { foreignKey: 'default_main_id' })
    };


    return PopupId;
};