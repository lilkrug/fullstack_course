module.exports = (sequelize, DataTypes) => {
    const Matches = sequelize.define("Matches", {
      dateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        time: true,
      },
      goals_first_team: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      goals_second_team: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      firstTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEqual: function(value) {
            if (value === this.secondTeamId) {
              throw new Error('First team and second team must be different');
            }
          }
        }
      },
      secondTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEqual: function(value) {
            if (value === this.firstTeamId) {
              throw new Error('Second team and first team must be different');
            }
          }
        }
      },
      // isHot: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   default: false
      // }
    },{
      timestamps: false
    });

    Matches.associate = (models) => {
        Matches.belongsTo(models.Teams, {as: 'firstTeam', foreignKey: 'firstTeamId'});
        Matches.belongsTo(models.Teams, {as: 'secondTeam', foreignKey: 'secondTeamId'});
    };

    return Matches;
  };
  