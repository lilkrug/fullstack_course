module.exports = (sequelize, DataTypes) => {
    const Tours = sequelize.define('Tours', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },{
        timestamps: false
      });

    Tours.associate = (models) => {
        Tours.belongsTo(models.Hotels, {
            onDelete: "cascade",
            foreignKey: 'hotelId'
        });
    };

    return Tours
}