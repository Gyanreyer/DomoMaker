const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  return newDomo.save()
        .then(() => res.json({ redirect: '/maker' }))
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists' });
          }

          return res.status(400).json({ error: 'An error occurred' });
        });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const removeDomo = (request, response) => {
  const req = request;
  const res = response;

  const search = {
    owner: req.session.account._id,
    _id: req.body._id,
  };

  return Domo.DomoModel.find(search).remove().exec((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(204).send();
  });
};

module.exports = {
  makerPage,
  getDomos,
  removeDomo,
  make: makeDomo,
};
