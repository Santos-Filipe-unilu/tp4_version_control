const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const database_connection = require('./db');
const port = 3000;


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/**
 * @api {post} / List cities
 * @apiGroup City Operations
 * @apiParam {String} name City Name
 * @apiSuccess {Object[]} city City
 * @apiSuccess {Number} city.ID City ID
 * @apiSuccess {String} city.Name City Name
 * @apiSuccess {String} city.CountryCode Country Code
 * @apiSuccess {String} city.District City District
 * @apiSuccess {Number} city.population Population
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [{
 *        "ID":2974,
 *        "Name":"Paris",
 *        "CountryCode":"FRA",
 *        "District":"Île-de-France",
 *        "Population":2125246
 *      }]
 *
 * @apiErrorExample {json} List Error
 *     HTTP/1.1 500 Internal Server Error
 */
app.post('/', (req, res) => {
  const {cityName} = req.body;
  database_connection.query('SELECT * FROM city WHERE Name = ?', [cityName] , function(error, result){
    if(!error){
      res.json(result);
    }
  });
});


/**
 * @api {post} /create Create/Insert a city
 * @apiGroup City Operations
 * @apiParam {Number} ID City ID
 * @apiParam {String} name City Name
 * @apiParam {Number} CountryCode Country Code
 * @apiParam {String} district City District
 * @apiParam {Number} population City Population
 * @apiSuccess {Object[]} city City
 * @apiSuccess {Number} city.ID City ID
 * @apiSuccess {String} city.Name City Name
 * @apiSuccess {String} city.CountryCode Country Code
 * @apiSuccess {String} city.District City District
 * @apiSuccess {Number} city.population Population
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [{
 *       "ID":900,
 *       "Name":"Test",
 *       "CountryCode":"TST",
 *       "District":"testDistrict",
 *       "Population":10000
 *     }]
 *
 * @apiErrorExample {json} List Error
 *     HTTP/1.1 500 Internal Server Error
 */
app.post('/create', (req, res) => {
  const {id,cityName, countryCode, district, populationCount} = req.body;
  var insert_query = 'INSERT INTO city (ID, Name, CountryCode, District, Population) VALUES (?,?,?,?,?)';
  var valuesToInsert = [id,cityName, countryCode, district, populationCount];
  insert_query = database_connection.format(insert_query, valuesToInsert);

  database_connection.query(insert_query, (error, rows) => {
    if(!error){
      database_connection.query('SELECT * FROM city WHERE Name = ?', [cityName] , function(error, result){
        if(!error){
          return res.json(result);
        }
      });
    }
  });
});


/**
 * @api {post} /update Update values from an existing city
 * @apiGroup City Operations
 * @apiParam {String} name City Name
 * @apiParam {Number} population City Population
 * @apiSuccess {Object[]} city City
 * @apiSuccess {Number} city.ID City ID
 * @apiSuccess {String} city.Name City Name
 * @apiSuccess {String} city.CountryCode Country Code
 * @apiSuccess {String} city.District City District
 * @apiSuccess {Number} city.population Population
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [{
 *       "ID":900,
 *       "Name":"Test",
 *       "CountryCode":"TST",
 *       "District":"testDistrict",
 *       "Population":50000
 *     }]
 *
 * @apiErrorExample {json} List Error
 *     HTTP/1.1 500 Internal Server Error
 */
app.post('/update', (req, res) => {
  const {cityName, populationCount} = req.body;
  var update_query = 'UPDATE city SET Population = ? WHERE Name = ?';
  var valuesToInsert = [populationCount, cityName];
  update_query = database_connection.format(update_query, valuesToInsert);

  database_connection.query(update_query, (error, result) => {
    if(!error){
      database_connection.query('SELECT * FROM city WHERE Name = ?', [cityName] , function(error, result){
        if(!error){
          return res.json(result);
        }
      });
    }
  })
});


/**
 * @api {post} /delete Delete a CIty
 * @apiGroup City Operations
 * @apiParam {String} name City Name
 * @apiSuccess {Object[]} result Result
 * @apiSuccess {String} result.status Status
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *       "status":"true"
 *     }
 *
 * @apiErrorExample {json} List Error
 *     HTTP/1.1 500 Internal Server Error
 */
app.post('/delete', (req,res) => {
  const {cityName} = req.body;
  var delete_query = 'DELETE FROM city WHERE city.Name = ?';
  var valuesToInsert = [cityName];
  delete_query = database_connection.format(delete_query, valuesToInsert);

  database_connection.query(delete_query, function(error, result){
    if(!error){
      if(result.affectedRows > 0){
        res.json({"status":"true"});
      }else{
        res.json({"status":"false"});
      }
    }
  });
});


app.listen(port, () => {
  console.log('Webservice running on port ', port)
});
