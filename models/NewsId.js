module.exports = (sequelize, DataTypes) => {
    const NewsId = sequelize.define(
        "NewsId",
        {
            mainId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            defaultMainId: {
                type: DataTypes.INTEGER,
            },
            postBy: DataTypes.INTEGER,
            postDate: DataTypes.DATE,
            postIp: DataTypes.STRING,
            updateBy: DataTypes.INTEGER,
            updateDate: DataTypes.DATE,
            updateIp: DataTypes.STRING,
            mainStatus: DataTypes.ENUM('deleted','pending','active'),
            sequence: DataTypes.INTEGER,
        },
        {
            tableName: "news_id",
            underscored: true,
            timestamps: false
        }
    );

    NewsId.associate = function (models) {
        NewsId.hasMany(models.NewsContent, { foreignKey: 'main_id' });
        NewsId.hasMany(models.NewsAttachment, { foreignKey: 'default_main_id' });
    };


    return NewsId;
};