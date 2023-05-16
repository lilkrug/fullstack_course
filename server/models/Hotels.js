module.exports = (sequelize, DataTypes) => {
    const Hotels = sequelize.define('Hotels', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        star_rating: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        CityId: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },{
        timestamps: false
      });
      Hotels.associate = (models) => {
        Hotels.belongsTo(models.Tours, {
          onDelete: "cascade",
        });
        Hotels.belongsTo(models.Cities, {
          onDelete: "cascade",
        });
      };
      
      return Hotels
    }