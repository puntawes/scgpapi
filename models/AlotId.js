module.exports = (sequelize, DataTypes) => {
    const AlotId = sequelize.define(
        "AlotId",
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
            tableName: "a_lot_id",
            underscored: true,
            timestamps: false
        }
    );

    AlotId.associate = function (models) {
        AlotId.hasMany(models.AlotContent, { foreignKey: 'main_id' })
        AlotId.hasMany(models.AlotAttachment, { foreignKey: 'default_main_id' })
    };

    
    return AlotId;
};