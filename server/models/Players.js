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
      matches: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      goals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      assists: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },{
    timestamps: false});

    return Players;
  };
  