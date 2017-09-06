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
  .then( days => {
    res.send(days);
  })
  .catch(next);
});

app.post('/', (req, res, next)=> {
  Day.create({})
    .then(day => {
      day.index = day.id;
      day.save();
      res.send(day);
    });
});

app.delete('/:id', (req, res, next)=> {
  Day.findById(req.params.id)
    .then(day => {
      day.destroy();
      res.send(day);
    })
});

app.post('/:dayId/hotels/:id', (req, res, next)=> {
  Promise.all([
      Day.findById(req.params.dayId),
      Hotel.findById(req.params.id)
    ])
    .then(([day, item]) => {
      day.addHotel(item);
      res.send(day);
    })
});

app.delete('/:dayId/hotels/:id', (req, res, next) => {
  Promise.all([
      Day.findById(req.params.dayId),
      Hotel.findById(req.params.id)
    ])
    .then(([day, item]) => {
      day.removeHotel(item);
      res.send(day);
    })
});

app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  Promise.all([
      Day.findById(req.params.dayId),
      Restaurant.findById(req.params.id)
    ])
    .then(([day, item]) => {
      day.addRestaurant(item);
      res.send(day);
    })
});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
  Promise.all([
      Day.findById(req.params.dayId),
      Restaurant.findById(req.params.id)
    ])
    .then(([day, item]) => {
      day.removeRestaurant(item);
      res.send(day);
    })
});

app.post('/:dayId/activities/:id', (req, res, next) => {
  Promise.all([
      Day.findById(req.params.dayId),
      Activity.findById(req.params.id)
    ])
    .then(([day, item]) => {
      day.addActivity(item);
      res.send(day);
    })
});

app.delete('/:dayId/activities/:id', (req, res, next) => {
  Promise.all([
      Day.findById(req.params.dayId),
      Activity.findById(req.params.id)
    ])
    .then(([day, item]) => {
      day.removeActivity(item);
      res.send(day);
    })
});

module.exports = app;
