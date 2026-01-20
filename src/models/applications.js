const { DataTypes} = require("sequelize")
const { sequelize } = require("../config/db");

const Applications = sequelize.define("application",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    companyName:{
        type:DataTypes.STRING,
    },
    jobRole:{
        type: DataTypes.STRING,
    },
    jobDescription:{
        type: DataTypes.TEXT,
    },
   
}, {
    timestamps: true,
});

Applications.associate = (models) =>{
    Applications.belongsTo(models.User, {
        foreignKey: "userId",
    })
}

module.exports =  Applications ;
