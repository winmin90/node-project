const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const Post = require("../schemas/post.js");

//  ---------------- 여기부터 API 시작 ----------------


router.get("/", async (req, res) => {
 
  const dataAll = await Post.find().sort({ createdAt: -1 });

  
  const data = [];
  for (let i = 0; i < dataAll.length; i++) {
    data.push({
      postId: dataAll[i]._id.toString(), 
      user: dataAll[i].user,
      title: dataAll[i].title,
      createdAt: dataAll[i].createdAt,
      updatedAt: dataAll[i].updatedAt,
      likes: post.likedBy.split(" ").length-1,
    });
  }

  res.json({ data: data }); 
});


router.post("/", authMiddleware, async (req, res) => {
  
  const { user, password, title, content } = req.body;
  const likeBy = "";

  
  await Post.create({
    user,
    password,
    title,
    content,
    createdAt: new Date(),
    likeBy 
  });

  
  res.json({ message: "게시글을 생성하였습니다." });
});


router.get("/:_postId", async (req, res) => {
  
  const { _postId } = req.params;

  
  const thisPost = await Post.findOne({ _id: _postId });

  
  if (!thisPost) {
    return res.json({ message: "해당 게시글이 없습니다." });
  }

  
  const data = [
    {
      postId: thisPost._id.toString(),
      user: thisPost.user,
      title: thisPost.title,
      content: thisPost.content,
      createdAt: thisPost.createdAt,
    },
  ];

  
  res.json({ data: data });
});


router.put("/:_postId", async (req, res) => {
  
  const { _postId } = req.params;
  
  const { password, title, content } = req.body;

  
  const thisPost = await Post.findOne({ _id: _postId });

  
  if (!thisPost) {
    return res.json({ message: "해당 게시글이 없습니다." });
  }

  
  const db_password = thisPost["password"];
  if (password != db_password) {
    console.log(password, db_password);
    return res.json({ message: "패스워드가 일치하지 않습니다." });
  }

  
  await Post.updateOne(
    {
      _id: _postId,
      
    },
    {
      $set: {
        
        password: password,
        title: title,
        content: content,
      },
    }
  );

  
  res.json({ message: "게시글을 수정하였습니다." });
});


router.delete("/:_postId", async (req, res) => {
  
  const { _postId } = req.params;
  
  const { password } = req.body;

  
  const thisPost = await Post.findOne({ _id: _postId });
  
  if (!thisPost) {
    return res.json({ message: "해당 게시글이 없습니다." });
  }

 
  const db_password = thisPost["password"];

  
  if (password != db_password) {
    res.json({ message: "패스워드가 일치하지 않습니다." });

    
  } else {
    await Post.deleteOne({
      _id: _postId,
    });
    
    res.json({ message: "게시글을 삭제하였습니다." });
  }
});


router.post("/many", async (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    var { user, password, title, content } = req.body[i];

    await Post.create({
      user,
      password,
      title,
      content,
      createdAt: new Date(),
    });
  }

  res.json({ message: "게시글을 생성하였습니다." });
});



module.exports = router;