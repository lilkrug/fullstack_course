module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },{
      timestamps: false
    });

    return Message;
  };
  