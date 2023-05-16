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
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },{
        timestamps: false
      });

    Tours.associate = (models) => {
        Tours.hasMany(models.Bookings, {
            onDelete: "cascade",
        });
        Tours.hasMany(models.Hotels, {
            onDelete: "cascade",
        });
    };

    return Tours
}