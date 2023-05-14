module.exports = (sequelize, DataTypes) => {
    const Teams = sequelize.define("Teams", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },{
      timestamps: false
    });

    Teams.associate = (models) => {
        Teams.hasMany(models.Players, {
          onDelete: "cascade",
          foreignKey: 'teamId'
        });
        Teams.hasMany(models.Matches, {as: 'firstTeam', foreignKey: 'firstTeamId'});
        Teams.hasMany(models.Matches, {as: 'secondTeam', foreignKey: 'secondTeamId'});
        Teams.belongsToMany(models.Posts, { through: models.PostsTeams });
    };

    return Teams;
  };
  