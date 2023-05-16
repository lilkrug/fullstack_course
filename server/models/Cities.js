module.exports = (sequelize, DataTypes) => {
    const Cities = sequelize.define("Cities", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },{
        timestamps: false
      });
  
    return Cities;
  };
  