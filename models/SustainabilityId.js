module.exports = (sequelize, DataTypes) => {
    const SustainabilityId = sequelize.define(
        "SustainabilityId",
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
            tableName: "sustainability_id",
            underscored: true,
            timestamps: false,
            paranoid: true,

        }
    );

    SustainabilityId.associate = function (models) {
        SustainabilityId.hasMany(models.SustainabilityContent, { foreignKey: 'mainId' })
        SustainabilityId.hasMany(models.SustainabilityAttachment, { foreignKey: 'default_main_id' })
    };

    return SustainabilityId;
};