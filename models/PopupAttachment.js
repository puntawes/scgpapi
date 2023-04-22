module.exports = (sequelize, DataTypes) => {
    const PopupAttachment = sequelize.define(
        "PopupAttachment",
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
            attachmentBaseDesktop: DataTypes.STRING,
            attachmentTypeDesktop: DataTypes.STRING,
            attachmentBaseMobile: DataTypes.STRING,
            attachmentTypeMobile: DataTypes.STRING,
            attachmentCate: DataTypes.STRING,
            attachmentText: DataTypes.STRING,
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
            tableName: "popup_attachment",
            underscored: true,
            timestamps: false
        }
    );


    return PopupAttachment;
};