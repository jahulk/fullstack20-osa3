require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
   return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
   Person
      .find({})
      .then(persons => {
         res.json(persons)
      })
})

app.post('/api/persons', (req, res) => {
   const { body } = req

   if (body.name === undefined || body.number === undefined || !body.name.length || !body.number.length) {
      return res.status(400).json({ error: 'name or number missing' })
   }

   const person = new Person({
      name: body.name,
      number: body.number,
   })

   person
      .save()
      .then(savedPerson => {
         res.json(savedPerson)
      })
})

app.get('/api/persons/:id', (req, res, next) => {
   Person
      .findById(req.params.id)
      .then(person => {
         if (person) {
            res.json(person)
         } else {
            res.status(404).end()
         }  
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
   const { body } = req

   const person = {
      name: body.name,
      number: body.number
   }

   Person
      .findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
         res.json(updatedPerson)
      })
      .catch(error => {
         next(error)
      })
})

app.delete('/api/persons/:id', (req, res, next) => {
   Person
      .findByIdAndRemove(req.params.id)
      .then(result => {
         res.status(204).end()
      })
      .catch(error => next(error))
})



app.get('/info', (req, res) => {
   Person
      .find({})
      .then(persons => {
         res.send(`Phonebook has info for ${persons.length} people <p>${new Date().toString()}</p>`)
      })
})

const unknownEndpoint = (req, res) => {
   response.status(404).send({ error: 'unknown endpoint' })
 }

 app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
   console.error(error.message)

   if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id'})
   }

   next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})