module.exports = (sequelize, DataTypes) => {
    const SystemUrlRewrite = sequelize.define(
        "SystemUrlRewrite",
        {
            urlRewriteId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            targetPath: {
                type: DataTypes.STRING,
            },
            targetDetailPath: {
                type: DataTypes.STRING,
            },
            targetMainPath: {
                type: DataTypes.STRING,
            },
          
        },
        {
            tableName: "system_url_rewrite",
            underscored: true,
            timestamps: false,
            paranoid: true,

        }
    );

    return SystemUrlRewrite;
};