const constants = require("../constant/constants.js");

module.exports = (sequelize, type) => {
    const ElevatorState = sequelize.define(
        constants.statusTable,
        {
            elevatorId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            currentFloor: {
                type: type.INTEGER,
                allowNull: false
            },
            statusId: {
                type: type.INTEGER,
                allowNull: true
            },
            direction: {
                type: type.STRING(100),
                allowNull: false
            },
            targetFloor: {
                type: type.INTEGER,
                allowNull: false
            },
            active: {
                type: type.BOOLEAN,
                allowNull: false,
            },
            currentAPIReq: {
                type: type.STRING(100),
                allowNull: false
            },
            queue: {
                type: type.ARRAY(type.STRING(100)),
                allowNull: false
            },
            updatedAt: {
                type: type.DATE,
                allowNull: false,
                default: new Date()
            }
        },
    );
    return ElevatorState;
};
