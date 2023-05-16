module.exports = (sequelize, DataTypes) => {
    const Bookings = sequelize.define('Bookings', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        countOfPeople: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      },{
        timestamps: false
      });
    
      Bookings.associate = (models) => {
        Bookings.belongsTo(models.Users, {
            onDelete: "cascade", foreignKey: 'userId'
          });
        Bookings.belongsTo(models.Tours, {
            onDelete: "cascade", foreignKey: 'tourId'
          });
      };

      return Bookings
    }