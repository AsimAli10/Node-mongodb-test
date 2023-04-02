 
 const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:admin@cluster0.syr8fbt.mongodb.net/?retryWrites=true&w=majority";
const express = require('express');
const app = express();
const port = 3000;


mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to MongoDB");
}
)
.catch((err) => {
    console.log("Error connecting to MongoDB", err);
}

);



const authorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  active: Boolean,
  addresses: [{
    street: String,
    city: String,
    zip: String,
    state: String,
    country: String,
  }],
  dateOfCreation: Date,
});

const publisherAddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zip: String,
  state: String,
  country: String,
});

const publisherSchema = new mongoose.Schema({
  name: String,
  addresses: [publisherAddressSchema],
});

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  body: String,
  language: String,
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  isbn: String,
  publishers: [{
    name: String,
    date: Date,
    addresses: [publisherAddressSchema],
  }],
  available: Boolean,
  ages: String,
  summary: String,
  subjects: [String],
  notes: [noteSchema],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
});

const categorySchema = new mongoose.Schema({
  name: String,
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],
});

const Author = mongoose.model('Author', authorSchema);
const User = mongoose.model('User', userSchema);
const Publisher = mongoose.model('Publisher', publisherSchema);
const Note = mongoose.model('Note', noteSchema);
const Book = mongoose.model('Book', bookSchema);
const Category = mongoose.model('Category', categorySchema);

const author = new Author({
    firstName: 'J.K.',
    lastName: 'Rowling',
    dateOfBirth: new Date('1965-07-31'),
  });
  
  const user = new User({
    username: 'johndoe',
    password: 'password123',
    active: true,
    addresses: [{
      street: '123 Main St',
      city: 'Anytown',
      zip: '12345',
      state: 'CA',
      country: 'USA',
    }],
    dateOfCreation: new Date(),
  });
  
  const publisher = new Publisher({
    name: 'Scholastic',
    addresses: [{
      street: '557 Broadway',
      city: 'New York',
      zip: '10012',
      state: 'NY',
      country: 'USA',
    }],
  });
  
  const note = new Note({
    user: user._id,
    body: 'Great book, highly recommend!',
    language: 'en',
  });
  
  const book = new Book({
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: author._id,
    isbn: '9780590353403',
    publishers: [publisher],
    available: true,
    ages: '8-12',
    summary: 'The first book in the Harry Potter series',
    subjects: ['Fantasy', 'Adventure'],
    notes: [note],
  });
  
  const category = new Category({
    name: 'Children\'s',
    books: [book._id],
  });
  
  const author1 = new Author({
    firstName: 'Danielle',
    lastName: 'Steel',
    dateOfBirth: new Date('1975-07-31'),
  });
  
  const user1 = new User({
    username: 'john smith',
    password: 'password123',
    active: true,
    addresses: [{
      street: '123 Main St',
      city: 'Boston',
      zip: '12345',
      state: 'CA',
      country: 'USA',
    }],
    dateOfCreation: new Date(),
  });
  
  const publisher1 = new Publisher({
    name: 'HarperCollins',
    addresses: [{
      street: '557 Broadway',
      city: 'Philadelphia',
      zip: '10012',
      state: 'NY',
      country: 'USA',
    }],
  });
  
  const note1 = new Note({
    user: user1._id,
    body: 'Nice book, recommend!',
    language: 'en',
  });
  
  const book1 = new Book({
    title: 'Something Blue',
    author: author1._id,
    isbn: '9780590353561',
    publishers: [publisher,publisher1],
    available: true,
    ages: '8-12',
    summary: 'Something Blue is a 2010 novel by Danielle Steel',
    subjects: ['Fantasy','Science Fiction'],
    notes: [note1],
  });
  
  const category1 = new Category({
    name: 'Children\'s',
    books: [book1._id],
  });
  
  // Save the data to the database
  author.save();
  user.save();
  publisher.save();
  note.save();
  book.save();
  category.save();
  author1.save();
  user1.save();
  publisher1.save();
  note1.save();
  book1.save();
  category1.save();
    


 // Retrieve all information on all of the books (All data associated with the books)
async function getAllBooks() {
    const books = await Book.find()
      .populate('author')
      .populate('publishers')
      .populate('notes.user')
      .populate('categories');
    return books;
  }
  
  // Retrieve all information on the books where the author first name = ‘Danielle' and lastname='Steel’
  async function getBooksByAuthor(authorFirstName, authorLastName) {
    const author = await Author.findOne({ 
      firstName: authorFirstName,
      lastName: authorLastName
    });
    const books = await Book.find({ author: author._id })
      .populate('author')
      .populate('publishers')
      .populate('notes.user')
      .populate('categories');
    return books;
  }
  

  // Retrieve all information on the users where the user id creation is > 15 DEC 2014 and the city = ‘Boston’
  async function getUsersByCreationDateAndCity() {
    const users = await User.find({
      dateOfCreation: { $gt: new Date('2014-12-15') },
      'addresses.city': 'Boston'
    });
    return users;
  }
  
  
  
  // Retrieve all information on books that have multiple publishers
  async function getBooksByMultiplePublishers() {
    const books = await Book.find({ 'publishers.1': { $exists: true } })
      .populate('author')
      .populate('publishers')
      .populate('notes.user')
      .populate('categories');
    return books;
  }
  
  // Retrieve all information on the books that have Notes
  async function getBooksWithNotes() {
    const books = await Book.find({ notes: { $exists: true } })
      .populate('author')
      .populate('publishers')
      .populate('notes.user')
      .populate('categories');
    return books;
  }
  
//Call the functions and log the results
    getAllBooks().then((books) => console.log('All Books:', books));
    getBooksByAuthor('Danielle', 'Steel').then((books) => console.log('Books by Danielle Steel:', books));
    getUsersByCreationDateAndCity().then((users) => console.log('Users in Boston created after 15 Dec 2014:', users));
    getBooksByMultiplePublishers().then((books) => console.log('Books with multiple publishers:', books));
    getBooksWithNotes().then((books) => console.log('Books with notes:', books));
  
