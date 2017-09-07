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
  Day.findById(req.params.id)
    .then(day => {
      return day.destroy();
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

app.post('/:dayId/hotels/:id', (req, res, next)=> {
  Promise.all([
      Day.findById(req.params.dayId),
      Hotel.findById(req.params.id)
    ])
    .then(([day, hotel]) => {
      return day.addHotel(hotel);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next)
});

app.delete('/:dayId/hotels/:id', (req, res, next) => {
  Promise.all([
      Day.findById(req.params.dayId),
      Hotel.findById(req.params.id)
    ])
    .then(([day, hotel]) => {
      return day.removeHotel(hotel);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  Promise.all([
      Day.findById(req.params.dayId),
      Restaurant.findById(req.params.id)
    ])
    .then(([day, restaurant]) => {
      return day.addRestaurant(restaurant);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
  Promise.all([
      Day.findById(req.params.dayId),
      Restaurant.findById(req.params.id)
    ])
    .then(([day, restaurant]) => {
      return day.removeRestaurant(restaurant);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

app.post('/:dayId/activities/:id', (req, res, next) => {
  Promise.all([
      Day.findById(req.params.dayId),
      Activity.findById(req.params.id)
    ])
    .then(([day, activity]) => {
      return day.addActivity(activity);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

app.delete('/:dayId/activities/:id', (req, res, next) => {
  Promise.all([
      Day.findById(req.params.dayId),
      Activity.findById(req.params.id)
    ])
    .then(([day, activity]) => {
      return day.removeActivity(activity);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = app;
