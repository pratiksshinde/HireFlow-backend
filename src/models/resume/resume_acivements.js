const {DataTypes} = require("sequelize");
const {sequelize} = require("../../config/db.js");

const ResumeAchivement = sequelize.define("ResumeAchivement" ,{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    resumeId:{
        type:DataTypes.INTEGER,
        allowNull:false 
    },
    achivement:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true
    }
},{
    timestamps:true,    
})

ResumeAchivement.associate = (models) =>{
    ResumeAchivement.belongsTo(models.Resume ,{
        foreignKey:"resumeId"
    });
};

module.exports={ResumeAchivement};