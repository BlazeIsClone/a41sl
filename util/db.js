const Sequelize = require("sequelize");
//? Very simple database since nothing too crazy is being stored.
const db = new Sequelize({
    dialect: "sqlite",
    logging: false,
    storage: "./db.sqlite"
});

const Stream = db.define("Stream", {
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    stream_id: {
        type: Sequelize.STRING
    }
});

db.init = async () => {
    console.log("[SQLite] Connected to database");
    await db.authenticate();
    await Stream.sync();
};

module.exports = { db, Stream };
