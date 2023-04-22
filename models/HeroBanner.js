module.exports = (sequelize, DataTypes) => {
    const hero_banner_page = sequelize.define(
        "hero_banner_page",
        {
            hero_banner_page_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            hero_banner_page_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            hero_banner_page_default: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            hero_banner_page_path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            post_by: DataTypes.INTEGER,
            post_date: DataTypes.DATE,
            post_ip: DataTypes.STRING,
            update_by: DataTypes.INTEGER,
            update_date: DataTypes.DATE,
            update_ip: DataTypes.STRING,
            hero_banner_page_status: DataTypes.ENUM('deleted','pending','active'),
        },
        {
            tableName: "hero_banner_page",
            // underscored: true,
            timestamps: false
        }
    );
    hero_banner_page.associate = function (models) {
        hero_banner_page.hasMany(models.hero_banner_content, { foreignKey: 'page_id' })
    };
    


    return hero_banner_page;
};