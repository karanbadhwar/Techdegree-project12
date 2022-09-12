const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {}

    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg: "Please Provide a Title!"
                },
                notEmpty:{
                    msg: "Title Cannot be left Empty!"
                }
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate:{
                notNull:{
                    msg: "Please Provide a Description!"
                },
                notEmpty:{
                    msg: "Description cannot be left empty!"
                }
            },
        },
        estimatedTime: {
            type: DataTypes.STRING,
        },
        materialsNeeded: {
            type: DataTypes.STRING,
        }
    }, {
        sequelize
    });

    Course.associate = (models) =>{
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }
        })
    }
    return Course;
}