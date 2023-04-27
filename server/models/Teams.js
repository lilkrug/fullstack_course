module.exports = (sequelize, DataTypes) => {
    const Teams = sequelize.define("Teams", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      league: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });

    Teams.associate = (models) => {
        Teams.hasMany(models.Players, {
          onDelete: "cascade",
        });
    };

    return Teams;
  };
  