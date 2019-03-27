var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise')
var url = 'https://swapi.co/api/planets/';
var planetStorage = [];

const getPlanets = (url) => {
  return rp(url).then(data => {
    var planet = JSON.parse(data);
    planetStorage = planetStorage.concat(planet.results)
    return planet.next ? getPlanets(planet.next) : Promise.resolve(planetStorage)
  })
}

router.get('/', function(req, res, next) {
  getPlanets(url).then(data => res.send(JSON.stringify(data)))
});

module.exports = router;
