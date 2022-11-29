const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())

app.use(morgan(function (tokens, req, res) {
  let reqdata = ''
  if (tokens.method(req, res) === 'POST') {
    reqdata = JSON.stringify(req.body)
  }
  
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    reqdata
  ].join(' ')
}))


let persons = [
  {
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
  },
  {
    "name": "Robert Poppendieck",
    "number": "39-23-6423123",
    "id": 5
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}


app.get('/info', (req, res) => {
  const numberPeople = 2
  const date = new Date
  res.send(
    `<p>Phonebook has info for ${numberPeople} people</p>
    <p> ${date}</p>`
    )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique'    
    })
  }

  const id = generateId()
  const person = {
      name: body.name,
      number: body.number,
      id: id,
  }
  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})