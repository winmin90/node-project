const mongoose = require("mongoose");

const mongo_local = "mongodb://localhost:27017/spa_mall";

const connect = () => {
    mongoose
        .connect(mongo_local, { ignoreUndefined: true })
        .catch((err) => console.error(err));
};

mongoose.connection.on("error", (err) => {
    console.error("몽고디비 연결 에러", err);
});

module.exports = connect;