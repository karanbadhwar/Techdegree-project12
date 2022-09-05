const { Model, Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    class User extends Model {}

    User.init({
        firstName: DataTypes.STRING,
        lastName: {
            type: DataTypes.STRING,
        },
        emailAddress: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
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