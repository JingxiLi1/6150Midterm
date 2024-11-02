// routes/comments.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 中间件函数定义
function isAuthenticated(req, res, next) {
  if (req.cookies.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// 加载评论数据
const commentsFile = path.join(__dirname, '../data/comments.json');
let comments = JSON.parse(fs.readFileSync(commentsFile, 'utf8'));

// 添加评论路由
router.post('/posts/:postId/comments', isAuthenticated, (req, res) => {
  const { content, parentId } = req.body;
  const comment = {
    id: Date.now(),
    postId: req.params.postId,
    author: req.cookies.user,
    content,
    parentId: parentId || null,
    date: new Date()
  };
  comments.push(comment);
  fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));
  res.redirect(`/posts/${req.params.postId}`);
});

module.exports = router;
