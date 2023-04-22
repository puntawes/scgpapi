module.exports = (sequelize, DataTypes) => {
    const SpotLightId = sequelize.define(
        "SpotLightId",
        {
            mainId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            defaultMainId: {
                type: DataTypes.INTEGER,
            },
            postBy: DataTypes.INTEGER,
            postDate: DataTypes.DATE,
            postIp: DataTypes.STRING,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            mainStatus: DataTypes.ENUM('deleted','pending','active'),
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "spotlight_id",
            underscored: true,
            timestamps: false
        }
    );

    SpotLightId.associate = function (models) {
        SpotLightId.hasMany(models.SpotLightContent, { foreignKey: 'main_id' })
        SpotLightId.hasMany(models.SpotLightAttachment, { foreignKey: 'default_main_id' })

    };

    return SpotLightId;
};