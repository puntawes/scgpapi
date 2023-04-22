module.exports = (sequelize, DataTypes) => {
    const SolutionCategoryId = sequelize.define(
        "SolutionCategoryId",
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
            tableName: "solution_category_id",
            underscored: true,
            timestamps: false
        }
    );

    SolutionCategoryId.associate = function (models) {
        SolutionCategoryId.hasMany(models.SolutionCategoryContent, { foreignKey: 'main_id' })
    };

    return SolutionCategoryId;
};