const mongoose = require('mongoose');
const personSchema = new mongoose.Schema({
    name:String,
    favouriteFoods: {
        required: [true, 'you have to add favourite food !!'],
        type: [String],
      },
      age: Number
    })
const person=mongoose.model('Person',personSchema)
module.exports = person;