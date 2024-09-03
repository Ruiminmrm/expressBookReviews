const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", async (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users[username]) {
        return res.status(400).json({ message: "Username already exists." });
    }

    users[username] = { password };
    return res.status(200).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    res.send(JSON.stringify(book, null, 2));
  } else {
    res.status(404).send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBook = []
  for (const book in books) {
    if(books[book].author === author){
      matchingBook.push(books[book]);
    }
  }
  if (matchingBook.length > 0){
    res.send(JSON.stringify(matchingBook, null, 2));
  } else {
    res.status(404).send("Book not found");
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBook = []
  for (const book in books) {
    if(books[book].title === title){
      matchingBook.push(books[book]);
    }
  }
  if (matchingBook.length > 0) {
    res.send(JSON.stringify(matchingBook, null, 2));
  } else {
    res.status(404).send("Book not found");
  }
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    res.send(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
