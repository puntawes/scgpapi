module.exports = (sequelize, DataTypes) => {
    const AwardId = sequelize.define(
        "AwardId",
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
            tableName: "award_id",
            // underscored: true,
            timestamps: false
        }
    );
    AwardId.associate = function (models) {
        AwardId.hasMany(models.AwardContent, { foreignKey: 'main_id' })
        AwardId.hasMany(models.AwardAttachment, { foreignKey: 'default_main_Id' })
    };
    


    return AwardId;
};