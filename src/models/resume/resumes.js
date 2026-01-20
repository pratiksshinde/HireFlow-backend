const { sequelize } = require("../../config/db");
const { DataTypes } = require("sequelize");

const Resume = sequelize.define("resume", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fullname: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
  
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});

Resume.associate = (models) => {
    Resume.hasMany(models.ResumeEducation, {
        foreignKey: "resumeId",
        as: "educations",
    });
    Resume.hasMany(models.ResumeExperience, {
        foreignKey: "resumeId",
        as: "experiences",
    });
    Resume.hasMany(models.ResumeSkill, {
        foreignKey: "resumeId",
        as: "skills",
    });
    Resume.hasMany(models.ResumeProject, {
        foreignKey: "resumeId",
        as: "projects",
    });
    Resume.hasMany(models.ResumeCertification, {
        foreignKey: "resumeId",
        as: "certifications",
    });
    Resume.hasMany(models.ResumeAchivement, {
        foreignKey: "resumeId",
        as: "achievements",
    });
    Resume.hasMany(models.ResumeLink, {
        foreignKey: "resumeId",
        as: "links",
    });
    Resume.belongsTo(models.User, {
        foreignKey: "userId",
    });
}

module.exports =  Resume ;