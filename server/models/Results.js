module.exports = (sequelize, DataTypes) => {
    const Results = sequelize.define("Results", {
      scored_goals: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      conceded_goals: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },{
      timestamps: false
    });

    Results.associate = (models) => {
        Results.belongsTo(models.Teams, {foreignKey: 'team_id'});
    };

    return Results;
  };
  