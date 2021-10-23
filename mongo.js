const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.1c9fa.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

// Mongoose automatically looks for the plural, lowercased version of your model name. I will be named notes collection in the database
const Note = mongoose.model("Note", noteSchema);

// since the objects are created with the model's constructor function, they have all the properties of the model,
// which include methods for saving the object to the database
// const note = new Note({
//   content: "HTML is Easy",
//   date: new Date(),
//   important: true,
// });

// const notes = Note.insertMany([
//   {
//     content: "HTML is Easy",
//     date: new Date(),
//     important: true,
//   },
//   {
//     content: "Mongoose makes use of mongo easy",
//     date: new Date(),
//     important: true,
//   },
//   {
//     content: "Callback-functions suck",
//     date: new Date(),
//     important: true,
//   },
// ]).then((docs) => {
//   console.log({ docs });
//   mongoose.connection.close(); // If the connection is not closed, the program will never finish its execution.
// });

// notes.notes.save().then((result) => {
//   console.log(result);
//   console.log("note saved");
//   mongoose.connection.close(); // If the connection is not closed, the program will never finish its execution.
// });

// find without condition
Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// start from terminal
// node mongo.js {password}
