const constants = require("../constant/constants.js");

module.exports = (sequelize, type) => {
    const Status = sequelize.define(
        constants.statusTable,
        {
            statusId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            status: {
                type: type.STRING(100),
                allowNull: true
            }
        },
    );
    return Status;
};
