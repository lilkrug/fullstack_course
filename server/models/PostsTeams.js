module.exports = (sequelize, DataTypes) => {
    const PostsTeams = sequelize.define("PostsTeams", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        // Дополнительные поля, если необходимо
      },{
        timestamps: false
      });
    return PostsTeams;
  };
  