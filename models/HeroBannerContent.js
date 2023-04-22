module.exports = (sequelize, DataTypes) => {
    const hero_banner_content = sequelize.define(
        "hero_banner_content",
        {
            content_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            main_id: {
                type: DataTypes.INTEGER,
            },
            lang_id: {
                type: DataTypes.STRING,
            },
            page_id: DataTypes.INTEGER,
            content_title: DataTypes.STRING,
            update_by: DataTypes.INTEGER,
            update_date: DataTypes.DATE,
            update_ip: DataTypes.STRING,
            content_status: DataTypes.ENUM('deleted','pending','active'),
        },
        {
            tableName: "hero_banner_content",
            // underscored: true,
            timestamps: false
        }
    );

    hero_banner_content.associate = function (models) {
        hero_banner_content.belongsTo(models.hero_banner_page, { foreignKey: 'hero_banner_page_id' })
    };

    hero_banner_content.associate = function (models) {
        hero_banner_content.belongsTo(models.hero_banner_id, { foreignKey: 'main_id' })
    };


    return hero_banner_content;
};