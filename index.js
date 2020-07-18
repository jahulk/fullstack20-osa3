const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
   return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [{
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
   },
   {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
   },
   {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
   },
   {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
   }
]

const generateId = () => (
   Math.floor(Math.random() * 100000)
 )

app.get('/api/persons', (req, res) => {
   res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id)
   const person = persons.find(person => person.id === id)

   if (person) {
      res.json(person)
   } else {
      res.status(404).end()
   }
})

app.delete('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id)
   persons = persons.filter(person => person.id !== id)

   res.status(204).end()
})

app.post('/api/persons', (req, res) => {
   const { body } = req

   if (body.name === undefined || body.number === undefined || !body.name.length || !body.number.length) {
      return res.status(400).json({ error: 'name or number missing' })
    }

   const personObject = {
      name: body.name,
      number: body.number,
      id: generateId()
   }

   if (persons.find(person => person.name === personObject.name)) {
      return res.status(409).json({ error: 'name must be unique' })
   } else {
      persons = persons.concat(personObject)
      res.json(personObject)
   }
})

app.get('/info', (req, res) => {
   res.send(`Phonebook has info for ${persons.length} people <p>${new Date().toString()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})