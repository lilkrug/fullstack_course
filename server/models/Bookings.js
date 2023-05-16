module.exports = (sequelize, DataTypes) => {
    const Bookings = sequelize.define('Bookings', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        booking_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        count_of_people: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      },{
        timestamps: false
      });
    
      Bookings.associate = (models) => {
        Bookings.belongsTo(models.Users, {
            onDelete: "cascade",
          });
        Bookings.belongsTo(models.Tours, {
            onDelete: "cascade",
          });
      };

      return Bookings
    }