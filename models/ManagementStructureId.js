module.exports = (sequelize, DataTypes) => {
    const ManagementStructureId = sequelize.define(
        "ManagementStructureId",
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
            tableName: "management_structure_id",
            underscored: true,
            timestamps: false
        }
    );
    ManagementStructureId.associate = function (models) {
        ManagementStructureId.hasMany(models.ManagementStructureContent, { foreignKey: 'main_id' })
        ManagementStructureId.hasMany(models.ManagementStructureAttachment, { foreignKey: 'default_main_id' })
    };
    return ManagementStructureId;
};