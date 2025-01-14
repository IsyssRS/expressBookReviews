const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        res.status(400).send("Username or password not provided");
    } else {
        filtered_users = users.filter((user) => user.username === username);
        if (filtered_users.length === 0){
            users.push({"username":username, "password":password});
            console.log(users);
            res.send("The user" + ' ' + username + " has been added!");
        } else {
            res.status(400).send("Username taken");
        }
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
  let filtered_books = Object.values(books).filter((book) => book.author === author);
  res.send(filtered_books)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_books = Object.values(books).filter((book) => book.title === title);
    res.send(filtered_books)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      res.send(books[isbn].reviews);
    } else {
      res.status(404).send('Book not found');
    }
});

module.exports.general = public_users;