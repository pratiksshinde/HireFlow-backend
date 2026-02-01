const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/db.js");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subscriptionStatus:{
        type: DataTypes.STRING,
        defaultValue: "free"
    },
    coldEmailCount:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    coldEmailResetAt:{
        type: DataTypes.DATE,
        allowNull:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

User.associate = (models) => {
    User.hasOne(models.Resume, {
        foreignKey: "userId",
        as: "resume",   
    });
};

module.exports = {User};