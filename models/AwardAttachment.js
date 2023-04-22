module.exports = (sequelize, DataTypes) => {
    const AwardAttachment = sequelize.define(
        "AwardAttachment",
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
            attachment_base: DataTypes.STRING,
            attachment_cate: DataTypes.STRING,
            attachment_type: DataTypes.STRING,
            attachment_link: DataTypes.TEXT,
            attachment_title: DataTypes.STRING,
            attachment_alt: DataTypes.STRING,
            attachment_status: DataTypes.ENUM('pending', 'active'),
            update_by: DataTypes.INTEGER,
            update_date: DataTypes.DATE,
            update_ip: DataTypes.STRING,
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "award_attachment",
            // underscored: true,
            timestamps: false
        }
    );
    return AwardAttachment;
};