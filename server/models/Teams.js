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
      },
      imagePath: {
        type: DataTypes.STRING
      }
    });

    Teams.associate = (models) => {
        Teams.hasMany(models.Players, {
          onDelete: "cascade",
        });
    };

    return Teams;
  };
  