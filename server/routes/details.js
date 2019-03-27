var express = require('express');
var router = express.Router();
var request = require('request');
var rp = require('request-promise')
var url = 'https://swapi.co/api/planets/';
//var planetStorage = [];

const getDatails = (urls, planetStorage = []) => {
  return rp(urls.pop()).then(data => {
    var details = JSON.parse(data);
    planetStorage.push(details)
    return urls.length ? getDatails(urls, planetStorage) : Promise.resolve(planetStorage)
  })
}


router.get('/', function(req, res, next) {
  const queries = req.query;
  let query = [];
  const keys = Object.keys(queries)
  keys.forEach((key, index )=> {
    query = query.concat(queries[key].split(','));
    if ((keys.length - 1) === index) {
      getDatails(query).then(data => {
        res.send(JSON.stringify(data))
      })
    }
  })
});

module.exports = router;
