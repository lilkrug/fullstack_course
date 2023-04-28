module.exports = (sequelize, DataTypes) => {
    const Players = sequelize.define("Players", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fieldNumber:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fieldPosition:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      club: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assists: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    return Players;
  };
  