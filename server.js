const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = 'bafffb8f7e0b1d58db054763f60865c8';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index', {weather: null, timezone: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${city}&inputtype=textquery&types=geocode&fields=formatted_address,name,geometry&locationbias=circle:2000@47.6918452,-122.2226413&key=AIzaSyDEi1PBMKHLAPCVDrx9FmT8JCIVlgFSZ0o`

    request(url, function (err, response, body) {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
            let location = JSON.parse(body);
            // if(location.main == undefined){
            //     res.render('index', {weather: null, error: 'Error, please try again'});
            // } else {
            //     let weatherText = `It's ${weather.currently.temperature} degrees in ${weather.name}!`;
            //     res.render('index', {weather: weatherText, error: null});
            // }
            // res.send(location);
            // res.send(location.candidates[0].geometry.location.lat)
            let lat = location.candidates[0].geometry.location.lat;
            let lng = location.candidates[0].geometry.location.lng;

            let darkurl = `https://api.darksky.net/forecast/${apiKey}/${lat},${lng}`
            request(darkurl, function (err, response, body) {
                if(err) {

                } else {
                    let weather = JSON.parse(body);
                    // res.send(weather);

                    let timezone = weather.timezone;
                    let temperature = weather.currently.temperature;
                    // res.send(temperature);

                    res.render('index', {timezone: timezone, weather: temperature, error: null});

                }

            })
        }
    });
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})