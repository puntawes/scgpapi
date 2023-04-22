module.exports = (sequelize, DataTypes) => {
    const CsrId = sequelize.define(
        "CsrId",
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
            tableName: "csr_id",
            underscored: true,
            timestamps: false
        }
    );

    CsrId.associate = function (models) {
        CsrId.hasMany(models.CsrContent, { foreignKey: 'main_id' })
        CsrId.hasMany(models.CsrAttachment, { foreignKey: 'default_main_id' })

    };

    
    return CsrId;
};