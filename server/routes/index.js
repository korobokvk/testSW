var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise')
var url = 'https://swapi.co/api/planets/';
//var planetStorage = [];

const getPlanets = (url, planetStorage = []) => {
  return rp(url).then(data => {
    var planet = JSON.parse(data);
    console.log(planet.next)
    //planetStorage = planetStorage.concat(planet.results)
    planet.results.forEach(element => {
      planetStorage.push(element)
    });
    return planet.next ? getPlanets(planet.next, planetStorage) : Promise.resolve(planetStorage)
  })
}

router.get('/', function(req, res, next) {
  getPlanets(url).then(data => res.send(JSON.stringify(data)))
});

module.exports = router;
