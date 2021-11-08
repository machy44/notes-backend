const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app); //for api calls

const Note = require('../models/note');

beforeEach(async () => {
  await Note.deleteMany({});
  console.log('cleared');

  // helper.initialNotes.forEach(async (note) => {
  //   // The problem is that every iteration of the forEach loop generates its own asynchronous operation,
  //   // and beforeEach won't wait for them to finish executing. In other words, the await commands
  //   // defined inside of the forEach loop are not in the beforeEach function,
  //   // but in separate functions that beforeEach will not wait for.
  //   let noteObject = new Note(note);
  //   await noteObject.save();
  //   console.log('saved');
  // });
  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  // Promise.all executes the promises it receives in parallel
  await Promise.all(noteObjects.map((note) => note.save())); //save() function creates promise

  console.log('done');
});

// for of is used when you want have a specific execution order
// beforeEach(async () => {
//   await Note.deleteMany({});

//   for (let note of helper.initialNotes) {
//     let noteObject = new Note(note);
//     await noteObject.save();
//   }
// });

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two notes', async () => {
  const response = await api.get('/api/notes');

  expect(response.body).toHaveLength(helper.initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map((r) => r.content);
  expect(contents).toContain('Browser can execute only Javascript');
});

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((n) => n.content);
  expect(contents).toContain('async/await simplifies making async calls');
});

test('note without content is not added', async () => {
  const newNote = {
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

test('a specifict note can be viewed', async () => {
  const notestAtStart = await helper.notesInDb();

  const noteToView = notestAtStart[0];

  const resultNote = await api.get(`/api/notes/${noteToView.id}`);

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
});

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

  const contents = notesAtEnd.map((r) => r.content);

  expect(contents).not.toContain(noteToDelete.content);
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});
