const Sequelize = require("sequelize");

let poolMaxConnections = 66;

let opts = {
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true,
        updatedAt: "updatedAt",
        timestamps: true
    },
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    pool: {
        max: poolMaxConnections,
        min: 0,
        idle: 60000,
        acquire: 100000,
        evict: 10000
    },
    benchmark: true,
    logging: (sql, timingMs) => {

        // console.log(`${sql} ------- [Execution time ------- ${timingMs}ms ]`);
    }
};

let sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, opts);

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((e) => {
        console.log(`Unable to connect to the database: ${e.message}`);
        process.exit();
    });


module.exports = {
    sequelize
}