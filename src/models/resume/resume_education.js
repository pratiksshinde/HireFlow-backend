const {DataTypes} = require("sequelize");
const {sequelize} = require("../../config/db.js");

const ResumeEducation = sequelize.define("ResumeEducation", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    resumeId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    institution:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    degree:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    fieldOfStudy:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    score:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
},{
    timestamps:true,
});

ResumeEducation.associate = (models) =>{
    ResumeEducation.belongsTo(models.Resume ,{
        foreignKey:"resumeId"
    });
};
module.exports={ResumeEducation };