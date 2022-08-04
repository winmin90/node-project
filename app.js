const express = require("express");
const jwt = require("jsonwebtoken")
const User = require("./models/user");
const authMiddleware = require("./middlewares/auth-middleware");
const mongoose = require("mongoose");
const cors = require("cors");
const port = 3000;


const app = express();
app.use(cors());
app.use(express.json());

const connect = require("./schemas/index.js")
connect();

const router = express.Router();
router.post("/users", async (req, res) => {
  const{ email, nickname, password, confirmPassword } = req.body;

  if( password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
    });
    return;
  }

  const existUsers = await User.findOne({
    $or: [{ email }, { nickname }],
  });
  if (existUsers) {
    res.status(400).send({
      errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다."
    });
    return;
  }

  const user = new User({ email, nickname, password });
  await user.save();

  res.status(201).send({});
});

router.post("/auth", async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      res.status(400).send({
          errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, "my-secret-key");
    res.send({
      token,
    });
  });

  router.get("/users/me", authMiddleware, async (req, res) => {     
    const { user } = res.locals; 
    res.status(400).send({});
  });

//const decoded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2NTk1MTAzMjl9.lpHZGLdN5DPJqav_CtzVbjf-DHdEPAeSKGNWgK3y7NM", "my-secret-key")

//console.log(decoded);

const indexRouter = require("./routes/index.js");
const user = require("./models/user.js");

app.use("/",router)
app.use("/api", [indexRouter]);

app.get("/", (req, res) => {
    res.send('Hello World!');
    });

app.listen(port, () => {
    console.log(`${3000} 번 포트로 연결이 완료되었습니다.`);
  });