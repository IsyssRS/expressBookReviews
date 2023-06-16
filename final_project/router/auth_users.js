const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      console.log(validusers); // add this line to log validusers
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
 isbn = req.params.isbn
 let review = req.query.review;

 if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "You must be logged in to add a review." });
  }

  // Get the username from the session
  let username = req.session.authorization.username;

 // Check if a book exists with the provided ID
 if(books.hasOwnProperty(isbn)){
   // If the book exists, add or update the review
   books[isbn].reviews[username] = review;

   res.status(200).json({ message: username +" " +"Review added/updated for" + ' ' + isbn +" " + "successfully." });
 } else {
   // If the book doesn't exist, send an error response
   res.status(404).json({ message: "Book not found." });
 }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;

    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(401).json({ message: "You must be logged in to delete a review." });
    }

    // Get the username from the session
    let username = req.session.authorization.username;

    if(books.hasOwnProperty(isbn)) {
        // If the book exists, check if the user has made a review
        if(books[isbn].reviews.hasOwnProperty(username)) {
            // If the user has made a review, delete it
            delete books[isbn].reviews[username];
        
            res.status(200).json({ message: username + " Review deleted for " + isbn + " successfully." });
        } else {
            // If the user hasn't made a review, send an error response
            res.status(404).json({ message: "Review not found." });
        }
    } else {
        // If the book doesn't exist, send an error response
        res.status(404).json({ message: "Book not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;