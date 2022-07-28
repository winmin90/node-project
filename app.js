const express = require("express");
const cors = require("cors");
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const connect = require("./schemas/index.js")
connect();

const indexRouter = require("./routes/index.js");
app.use("/api", [indexRouter]);

app.get("/", (req, res) => {
    res.send('Hello World!');
    });

app.listen(port, () => {
    console.log(`${3000} 번 포트로 연결이 완료되었습니다.`);
  });