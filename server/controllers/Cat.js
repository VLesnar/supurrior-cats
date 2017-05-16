const models = require('../models');

const Cat = models.Cat;

// Adds a cat to the database
const addCat = (req, res) => {
  const catData = {
    name: req.body.name,
    adventurousness: req.body.adv,
    agility: req.body.agl,
    intelligence: req.body.int,
    stretch: req.body.str,
    owner: req.session.account._id,
  };

  const newCat = new Cat.CatModel(catData);

  const catPromise = newCat.save();

  catPromise.then(() => {
    res.json({ redirect: '/profile' });
  });

  catPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Cat already exists!' });
    }

    return res.status(400).json({ error: 'An error occurred!' });
  });

  return catPromise;
};

const profilePage = (req, res) => {
  Cat.CatModel.findByOwner(req.session.account._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    return res.render('profile', { csrfToken: req.csrfToken() });
  });
};

// Updates the cat model based on the form sent in by the user
const updateCat = (req, res) => {
  const catPromise = Cat.CatModel.findOne({ name: req.body.name });

  catPromise.then((ct) => {
    const cat = ct;
    cat.adventurousness = parseInt(req.body.adventurousness, 10);
    cat.agility = parseInt(req.body.agility, 10);
    cat.intelligence = parseInt(req.body.intelligence, 10);
    cat.stretch = parseInt(req.body.stretch, 10);

    const savePromise = cat.save();

    savePromise.then(() => {
      res.json({ redirect: '/profile' });
    });
  });
};

// Makes a cat based on input from a form
// NOTE: Is not used in the current form of the application
const makeCat = (req, res) => {
  if (!req.body.name || !req.body.adv || !req.body.agl || !req.body.int ||
     !req.body.str) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const catData = {
    name: req.body.name,
    adventurousness: req.body.adv,
    agility: req.body.agl,
    intelligence: req.body.int,
    stretch: req.body.str,
    owner: req.session.account._id,
  };

  const newCat = new Cat.CatModel(catData);

  const catPromise = newCat.save();

  catPromise.then(() => {
    res.json({ redirect: '/profile' });
  });

  catPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Cat already exists!' });
    }

    return res.status(400).json({ error: 'An error occurred!' });
  });

  return catPromise;
};

const getCats = (req, res) => {
  const request = req;
  const response = res;

  return Cat.CatModel.findByOwner(request.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occured!' });
    }

    return response.json({ cats: docs });
  });
};

module.exports.profilePage = profilePage;
module.exports.getCats = getCats;
module.exports.make = makeCat;
module.exports.update = updateCat;
module.exports.addCat = addCat;
module.exports.updateCat = updateCat;
