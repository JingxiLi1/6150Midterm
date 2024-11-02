const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments'); // 假设有评论路由

// 使用路由
app.use('/', authRoutes);
app.use('/', postRoutes);
app.use('/', commentRoutes); // 添加评论路由

// 添加根路由
app.get('/', (req, res) => {
  res.render('index'); // 假设有一个 views/index.ejs 作为首页
});

// 监听端口
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
