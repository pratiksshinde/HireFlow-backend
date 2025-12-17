const {DataTypes} = require("sequelize");
const {sequelize} = require("../../config/db.js");

const ResumeSkill = sequelize.define("ResumeSkill",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        resumeId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        category:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        skill:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        proficiency:{
            type:DataTypes.INTEGER,
            allowNull:true,
        }
    },{
        timestamps:true,
    })

ResumeSkill.associate =(models)=>{
    ResumeSkill.belongsTo(models.Resume,
        {
            foreignKey: "resumeId"
        }
    );
};

module.exports={ResumeSkill};