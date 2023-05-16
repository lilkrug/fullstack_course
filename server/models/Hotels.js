module.exports = (sequelize, DataTypes) => {
  const Hotels = sequelize.define('Hotels', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    starRating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });
  Hotels.associate = (models) => {
    Hotels.belongsTo(models.Cities, {foreignKey: 'cityId'});
  };

  return Hotels
}