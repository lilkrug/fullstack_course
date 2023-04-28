module.exports = (sequelize, DataTypes) => {
    const Teams = sequelize.define("Teams", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    Teams.associate = (models) => {
      Teams.hasOne(models.Images, {
        onDelete: "cascade",
      });
    };

    return Teams;
  };
  