const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userMatches = users.filter(user => user.username === username);
  return userMatches.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let userMatches = users.filter(user => user.username === username && user.password === password);
  return userMatches !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
          data: username
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
          accessToken
      }
      return res.status(200).json({ message: "User successfully logged in" });
  } else {
      return res.status(401).json({ message: "Invalid Username or Password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review){
    return res.status(400).json({ message: "Review is required" });
  }

  const username = req.session.authorization.data;
  if (!books[isbn]){
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]){
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  }else{
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });  
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const username = req.session.authorization.data;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
  } else {
      return res.status(404).json({ message: "Review not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
