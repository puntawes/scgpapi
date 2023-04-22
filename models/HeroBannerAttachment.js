module.exports = (sequelize, DataTypes) => {
    const hero_banner_attachment = sequelize.define(
        "hero_banner_attachment",
        {
            attachment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            default_main_id: {
                type: DataTypes.INTEGER,
            },
            lang_id: {
                type: DataTypes.STRING,
            },
            attachment_base_desktop: DataTypes.STRING,
            attachment_base_mobile: DataTypes.STRING,
            attachment_cate: DataTypes.STRING,
            attachment_type: DataTypes.STRING,
            attachment_text: DataTypes.TEXT,
            attachment_link: DataTypes.TEXT,
            attachment_title: DataTypes.STRING,
            attachment_alt: DataTypes.STRING,
            attachment_status: DataTypes.ENUM('pending', 'active'),
            attachment_date_time:DataTypes.DATE,
            update_by: DataTypes.INTEGER,
            update_date: DataTypes.DATE,
            update_ip: DataTypes.STRING,
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "hero_banner_attachment",
            // underscored: true,
            timestamps: false
        }
    );
    // hero_banner_attachment.associate = function (models) {
    //     hero_banner_attachment.belongsTo(models.hero_banner_content, { foreignKey: 'main_id' })
    // };


    // hero_banner_page.hasMany(Company, { foreignKey: 'owner_id' });
    // Company.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });

    return hero_banner_attachment;
};