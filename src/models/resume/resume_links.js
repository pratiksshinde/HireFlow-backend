const {DataTypes} = require("sequelize");
const {sequelize} = require("../../config/db.js");

const ResumeLink = sequelize.define("ResumeLink", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    resumeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,   
})

ResumeLink.associate =(models)=>{
    ResumeLink.belongsTo(models.Resume ,{
        foreignKey:"resumeId"
    });
};

module.exports = {ResumeLink};