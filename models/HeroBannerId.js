module.exports = (sequelize, DataTypes) => {
    const hero_banner_id = sequelize.define(
        "hero_banner_id",
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
            tableName: "hero_banner_id",
            // underscored: true,
            timestamps: false
        }
    );
    // hero_banner_id.associate = function (models) {
    //     hero_banner_id.belongsTo(models.hero_banner_content, { foreignKey: 'main_id' })
    // };


    // hero_banner_page.hasMany(Company, { foreignKey: 'owner_id' });
    // Company.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });

    return hero_banner_id;
};