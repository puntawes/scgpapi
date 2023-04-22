module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define(
        "Branch",
        {
            branchId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            langId: DataTypes.STRING,
            productCategory: DataTypes.STRING,
            country: DataTypes.STRING,
            province: DataTypes.STRING,
            branchDesc: DataTypes.STRING,
            branchTitle: DataTypes.STRING,
            branchAddress: DataTypes.STRING,
            branchTel : DataTypes.STRING,
            lat_lng : DataTypes.STRING,
            createDate: DataTypes.DATE,
            updateDate: DataTypes.DATE,
            status: DataTypes.ENUM('active', 'disables', 'deleted'),
        },
        {
            tableName: "branch",
            underscored: true,
            timestamps: false
        }
    );

    return Branch;
};