module.exports = (sequelize, DataTypes) => {
    const Images = sequelize.define("Images", {
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      }
    },{
      timestamps: false
    });

    return Images;
  };
  