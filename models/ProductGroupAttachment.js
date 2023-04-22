module.exports = (sequelize, DataTypes) => {
    const ProductGroupAttachment = sequelize.define(
        "ProductGroupAttachment",
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
            tableName: "product_group_attachment",
            underscored: true,
            timestamps: false
        }
    );


    return ProductGroupAttachment;
};