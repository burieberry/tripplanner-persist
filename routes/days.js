const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next)=> {
  Day.findAll({
    order: [ 'id' ],
    include: [
      { model: Hotel, include: [ Place ] },
      { model: Restaurant, include: [ Place ] },
      { model: Activity, include: [ Place ] }
    ]
  })
  .then(days => {
    res.send(days);
  })
  .catch(next);
});

app.post('/', (req, res, next)=> {
  Day.create()
    .then(day => {
      res.send(day);
    });
});

app.delete('/:id', (req, res, next)=> {
  Day.destroy({ where: {id: req.params.id }})
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

var pascalCase = require('pascal-case'); // to make the initial uppercase

[ Hotel, Restaurant, Activity ].forEach(model => {
  [ 'post', 'delete' ].forEach(verb => {
    app[verb](`/:dayId/${model.tableName}/:id`, (req, res, next) => {
      Promise.all([
        Day.findById(req.params.dayId),
        model.findById(req.params.id)
      ])
      .then(([day, item]) => {
        return day[`${verb === 'post' ? 'add' : 'remove'}${pascalCase(model.name)}`](item);
      })
      .then(() => {
        res.sendStatus(204);
      })
      .catch(next)
    })
  });
});

module.exports = app;
