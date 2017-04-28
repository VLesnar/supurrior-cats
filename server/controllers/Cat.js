const models = require('../models');

const Cat = models.Cat;

const adoptPage = (req, res) => {
  Cat.CatModel.findByOwner(req.session.account._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    return res.render('adopt', { csrfToken: req.csrfToken() });
  });
};

const makerPage = (req, res) => {
  Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), cats: docs });
  });
};

// Updates the cat model based on the form sent in by the user
const updateCat = (req) => {
  Cat.update(
    { name: req.body.name },
    { $set: { adventurousness: req.body.adv } }
  );
  Cat.update(
    { name: req.body.name },
    { $set: { agility: req.body.agl } }
  );
  Cat.update(
    { name: req.body.name },
    { $set: { intelligence: req.body.int } }
  );
  Cat.update(
    { name: req.body.name },
    { $set: { stretch: req.body.str } }
  );
};

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
    res.json({ redirect: '/maker' });
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

module.exports.makerPage = makerPage;
module.exports.getCats = getCats;
module.exports.make = makeCat;
module.exports.update = updateCat;
module.exports.adoptPage = adoptPage;
