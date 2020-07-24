const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-tgw38.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
   name: String,
   number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
   const name = process.argv[3]
   const number = process.argv[4]

   const person = new Person({
      name,
      number
   })

   person
      .save()
      .then(res => {
         console.log(`Added ${name} ${number} to phonebook`)
         mongoose.connection.close()
      })
} else if (process.argv.length === 3) {
   Person
      .find({})
      .then(result => {
         console.log('phonebook:')
         result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
         })
         mongoose.connection.close()
      })
} else {
   process.exit(1)
}