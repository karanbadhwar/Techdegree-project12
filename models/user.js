const { Model, Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class User extends Model {}

    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg: "please provide a First Name!"
                }
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg: "Please provide a Last Name!"
                }
            },
        },
        emailAddress: {
            type: DataTypes.STRING,
            unique: {
                args: true,
                msg: "Email already in Use!"
            },
            allowNull: false,
            validate:{
                notNull:{
                    msg: "Please Provide an Email Address!"
                },
                isEmail:{
                    msg: "please provide a valid Email!"
                }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg: "Please Provide a Password!"
                },
                notEmpty:{
                    msg: "Password Cannot be left Empty!"
                },

            },
        },
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey:{
                fieldName: 'userId',
                allowNull: false,
            },
        })
    }
    return User;
}