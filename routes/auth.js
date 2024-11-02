const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');
let users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));


router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.send('Email already exists');
  }

  
  users.push({ email, password });
  fs.writeFileSync(usersFile, JSON.stringify(users));
  res.redirect('/login');
});


router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.cookie('user', email); 
    res.redirect('/'); 
  } else {
    res.send('Invalid credentials');
  }
});


router.get('/logout', (req, res) => {
  res.clearCookie('user'); 
  res.redirect('/');
});

module.exports = router;
