const {DataTypes} = require("sequelize");
const {sequelize} = require("../../config/db.js");

const ResumeExperience = sequelize.define("ResumeExperience", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    resumeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isCurrentlyWorking: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});

ResumeExperience.associate = (models)=>{
    ResumeExperience.belongsTo(models.Resume,{
        foreignKey:"resumeId"
    })
}

module.exports = {ResumeExperience};    