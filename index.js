const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Note = require('./src/models/note');
const middlewares = require('./src/middlewares');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.use(middlewares.requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>'); // express automatically sets the value of the Content-Type header to be text/html
});

app.get('/api/notes', (request, response) => {
  Note.find().then((notes) => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.post('/api/notes', (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.use(middlewares.unknownEndpoint);

// this has to be the last loaded middleware.
app.use(middlewares.errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
