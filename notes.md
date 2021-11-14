```javascript
// helper.initialNotes.forEach(async (note) => {
  //    The problem is that every iteration of the forEach loop generates its own asynchronous operation,
  //    and beforeEach won't wait for them to finish executing. In other words, the await commands
  //    defined inside of the forEach loop are not in the beforeEach function,
  //    but in separate functions that beforeEach will not wait for.
  //   let noteObject = new Note(note);
  //   await noteObject.save();
  //   console.log('saved');
  // });
  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  // Promise.all executes the promises it receives in parallel
  await Promise.all(noteObjects.map((note) => note.save())); //save() function creates promise
});

// for of is used when you want have a specific execution order
// beforeEach(async () => {
//   await Note.deleteMany({});

//   for (let note of helper.initialNotes) {
//     let noteObject = new Note(note);
//     await noteObject.save();
//   }
// });
```


Good to know about referencing in mongodb https://fullstackopen.com/en/part4/user_administration#references-across-collections