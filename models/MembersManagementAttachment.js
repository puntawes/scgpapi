module.exports = (sequelize, DataTypes) => {
    const MembersManagementAttachment = sequelize.define(
        "MembersManagementAttachment",
        {
            attachmentId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            defaultMainId: {
                type: DataTypes.INTEGER,
            },
            langId: {
                type: DataTypes.STRING,
            },
            attachmentBase: DataTypes.STRING,
            attachmentCate: DataTypes.STRING,
            attachmentType: DataTypes.STRING,
            attachmentLink: DataTypes.TEXT,
            attachmentTitle: DataTypes.STRING,
            attachmentAlt: DataTypes.STRING,
            attachmentStatus: DataTypes.ENUM('pending', 'active'),
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "members_management_attachment",
            underscored: true,
            timestamps: false
        }
    );


    return MembersManagementAttachment;
};