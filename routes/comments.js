const express = require("express");
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");

//  ---------------- 여기부터 API 시작 ----------------

router.post("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  
  const { user, password, content } = req.body;
  
  if (!content) {
    return res.json({ message: "댓글 내용을 입력해주세요" });
  }
  
  const posts = await Post.find({ _id: _postId });
  
  if (!posts.length) {
    return res.json({ message: "해당 게시글이 없습니다." });
  }
  
  await Comment.create({
    _postId,
    user,
    password,
    content,
    createdAt: new Date(),
  });
  
  res.json({ message: "댓글을 생성하였습니다." });
});

router.get("/:_postId", async (req, res) => {

  const { _postId } = req.params;
  
  const posts = await Post.find({ _id: _postId }).sort({ createdAt: -1 });
  
  if (!posts.length) {
    return res.json({ message: "해당 게시글이 없습니다." });
  }
  
  const allCommentInfo = await Comment.find({ _postId }).sort({
    createdAt: -1,
  });
  const data = [];
  
  for (let i = 0; i < allCommentInfo.length; i++) {
    data.push({
      commentId: allCommentInfo[i]._id.toString(),
      user: allCommentInfo[i].user,
      content: allCommentInfo[i].content,
      createdAt: allCommentInfo[i].createdAt,
    });
  }
  
  res.json({ data: data });
});


router.put("/:_commentId", async (req, res) => {
  
  const { _commentId } = req.params;
  
  const { password, content } = req.body;
  
  const comments = await Comment.findOne({ _id: _commentId });
  
  if (!comments) {
    return res.json({ message: "해당 댓글이 없습니다." });
  }

  
  if (!content) {
    return res.json({ message: "댓글 내용을 입력해주세요" });
  }

  
  const db_password = comments["password"];
  if (db_password != password) {
    return res.json({ message: "비밀번호를 확인해주세요." });
  }

  
  await Comment.updateOne(
    {
      _id: _commentId, 
    },
    {
      
      $set: {
        password: password,
        content: content,
      },
    }
  );

  
  res.json({ message: "댓글을 수정하였습니다." });
});


router.delete("/:_commentId", async (req, res) => {
  
  const { _commentId } = req.params;
  
  const { password } = req.body;

  
  const comments = await Comment.findOne({ _id: _commentId });

  
  if (!comments) {
    return res.json({ message: "해당 댓글이 없습니다." });
  }

  
  const db_password = comments["password"];
  if (db_password != password) {
    return res.json({ message: "비밀번호를 확인해주세요." });

    
  } else {
    await Comment.deleteOne({ _id: _commentId });

    
    return res.json({ message: "댓글을 삭제하였습니다." });
  }
});


router.post("/:_postId/many", async (req, res) => {
  const { _postId } = req.params;

  const posts = await Post.find({ _id: _postId });
  if (!posts.length) {
    return res.json({ message: "해당 게시글이 없습니다." });
  }

  for (let i = 0; i < req.body.length; i++) {
    var { user, password, content } = req.body[i];

    await Comment.create({
      _postId,
      user,
      password,
      content,
      createdAt: new Date(),
    });
  }

  res.json({ message: "댓글을 생성하였습니다." });
});

module.exports = router;