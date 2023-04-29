module.exports = (sequelize, DataTypes) => {
    const FieldPositions = sequelize.define("FieldPositions", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },{
      timestamps: false
    });

    
    FieldPositions.associate = (models) => {
        FieldPositions.hasMany(models.Players, {
          foreignKey: 'fieldPositionId'
        })
    };

    return FieldPositions;
  };
  