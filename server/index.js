import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// Create a custom token for logging request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Use morgan with custom format that includes request body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number missing' 
    });
  }

  const existingPerson = persons.find(p => p.name === body.name);
  if (existingPerson) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'person not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personExists = persons.find(p => p.id === id);
  
  if (personExists) {
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'person not found' });
  }
});

app.get('/info', (req, res) => {
  const peopleCount = persons.length;
  const currentTime = new Date().toString();
  
  res.send(`
    <p>Phonebook has info for ${peopleCount} people</p>
    <p>${currentTime}</p>
  `);
});

// Serve index.html for all routes not handled above (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});