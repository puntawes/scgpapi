module.exports = (sequelize, DataTypes) => {
    const MembersManagementId = sequelize.define(
        "MembersManagementId",
        {
            main_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            default_main_id: {
                type: DataTypes.INTEGER,
            },
            post_by: {
                type: DataTypes.INTEGER,
            },
            post_date: DataTypes.DATE,
            post_ip: DataTypes.STRING,
            update_by: DataTypes.INTEGER,
            update_date: DataTypes.DATE,
            update_ip: DataTypes.STRING,
            main_status: DataTypes.ENUM('deleted','pending','active'),
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "members_management_id",
            underscored: true,
            timestamps: false
        }
    );


    MembersManagementId.associate = function (models) {
        MembersManagementId.hasMany(models.MembersManagementContent, { foreignKey: 'main_id' })
        MembersManagementId.hasMany(models.MembersManagementAttachment, { foreignKey: 'default_main_id' })
    };

    return MembersManagementId;
};