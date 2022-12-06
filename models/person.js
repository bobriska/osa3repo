const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(console.log('connected to MongoDB'))
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Name of minimum 3 characters required']
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /[0-9]{2,3}-[0-9]+/.test(v)
      },
      message: function() {
        return 'Phone number must be minimum 8 digits and a - after two or three first digits' }
    },
    required: [true, 'Phone number in format required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
