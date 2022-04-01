const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

notes.get('/', (req, res) => {
    readFromFile('./db/notes.json').then((data) =>
      res.json(JSON.parse(data))
    );
});

notes.post('/', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        note_id: uuidv4(),
      };
  
      readAndAppend(newNote, './db/notes.json');

      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding Note');
    }
});

notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id !== noteId);

      writeToFile('./db/notes.json', result);

      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = notes;