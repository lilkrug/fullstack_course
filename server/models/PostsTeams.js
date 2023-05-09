module.exports = (sequelize, DataTypes) => {
  const PostsTeams = sequelize.define("PostsTeams", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Дополнительные поля, если необходимо
  }, {
    timestamps: false
  });

  PostsTeams.associate = (models) => {
    models.Posts.belongsToMany(models.Teams, { through: PostsTeams, onDelete: 'CASCADE' });
    models.Teams.belongsToMany(models.Posts, { through: PostsTeams });
  };

  return PostsTeams;
};
