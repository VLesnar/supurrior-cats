const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const _ = require('underscore');

let CatModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// Add stats for cats
const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{5,20}$/, // Makes sure the name is between 5-20 characters
  },
  adventurousness: {
    type: Number,
    min: 0,
    required: true,
  },
  agility: {
    type: Number,
    min: 0,
    required: true,
  },
  intelligence: {
    type: Number,
    min: 0,
    required: true,
  },
  stretch: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

CatSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

CatSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CatModel.find(search).select('name adventurousness agility intelligence stretch')
    .exec(callback);
};

CatModel = mongoose.model('Cat', CatSchema);

module.exports.CatModel = CatModel;
module.exports.CatSchema = CatSchema;
