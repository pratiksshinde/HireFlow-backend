const {DataTypes} = require("sequelize");
const {sequelize} = require("../../config/db.js");

const ResumeCertification = sequelize.define("ResumeCertification", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    resumeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    certificationName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issuingOrganization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

ResumeCertification.associate = (models) =>{
    ResumeCertification.belongsTo(models.Resume ,{
        foreignKey:"resumeId"
    });
};  

module.exports = {ResumeCertification};    