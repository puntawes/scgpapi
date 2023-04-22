module.exports = (sequelize, DataTypes) => {
    const PageId = sequelize.define(
        "PageId",
        {
            main_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            default_main_id: {
                type: DataTypes.INTEGER,
            },
            label_id: {
                type: DataTypes.STRING,
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
            tableName: "page_id",
            underscored: true,
            timestamps: false
        }
    );


    PageId.associate = function (models) {
        PageId.hasMany(models.PageContent, { foreignKey: 'main_id' })
    };


    return PageId;
};