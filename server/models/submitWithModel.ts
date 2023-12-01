const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Application } = require("./applicationModel");
const { Document } = require("./documentModel");

const Submit_With = sequelize.define(
    "SUBMIT_WITH",
    {
        ApplicationID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Application,
                key: "ApplicationID",
            }
        },
        DocumentID: {
            type: DataTypes.STRING(32),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Document,
                key: "DocumentID",
            }
        }
    },
    {
        timestamps: false,
    }
);

Document.belongsToMany(Application, {
    through: Submit_With,
    foreignKey: "DocumentID",
});
Application.belongsToMany(Document, {
    through: Submit_With,
    foreignKey: "ApplicationID",
});

sequelize.sync();
exports.Submit_With = Submit_With;