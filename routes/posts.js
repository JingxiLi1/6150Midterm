const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load posts data
const postsFile = path.join(__dirname, '../data/posts.json');
let posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));

// Middleware: Check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.cookies.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Render new post creation page
router.get('/posts/new', isAuthenticated, (req, res) => {
  res.render('newPost');
});

// Handle new post creation
router.post('/posts', isAuthenticated, (req, res) => {
  const { title, body, tags } = req.body;
  const post = {
    id: Date.now(),
    title,
    body,
    tags: tags ? tags.split(',') : [],
    author: req.cookies.user,
    date: new Date(),
    likes: 0 // Initialize likes to 0
  };
  posts.push(post);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.redirect('/posts');
});

// Display all posts
router.get('/posts', (req, res) => {
  res.render('posts', { posts });
});

// Handle post like
router.post('/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (post) {
    // Check if user has already liked the post
    if (req.cookies[`liked_${postId}`]) {
      return res.json({ success: false, message: "You have already liked this post." });
    }

    post.likes += 1; // Increment like count
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    // Set a cookie to mark that the user has liked this post
    res.cookie(`liked_${postId}`, true, { maxAge: 24 * 60 * 60 * 1000 }); // Cookie valid for 1 day
    res.json({ success: true, likes: post.likes });
  } else {
    res.status(404).json({ success: false, message: "Post not found" });
  }
});

module.exports = router;

