const {DataTypes} = require("sequelize");
const {sequelize} = require("../../config/db.js");

const ResumeProject = sequelize.define("ResumeProject", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    resumeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

ResumeProject.associate = (models) =>{
    ResumeProject.belongsTo(models.Resume ,{
        foreignKey:"resumeId"
    });
};

module.exports = {ResumeProject};