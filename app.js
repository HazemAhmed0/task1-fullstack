// import dependancies
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

//API
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://community-open-weather-map.p.rapidapi.com/find',
  params: {
    q: 'london',
  },
  headers: {
    'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
    'x-rapidapi-key': 'baef9d49ddmsh639f6da92592444p140fe2jsn1d951d9f7207'
  }
};

let currw;

axios.request(options).then(function (response) {
	currw = Math.round((response.data.list[0].main.temp - 273) * 10) / 10 + ' °C';
}).catch(function (error) {
	console.error(error);
});




const app = express();
const dbURI = "mongodb+srv://task1test:test112233@cluster1test.6ncya.mongodb.net/task-1?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// set ejs as view engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

/*
app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'Test 1',
    snippet: 'Lorem Ipsum',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  });

  blog.save().then((result) => {res.send(result)}).catch((err)=> console.log(err));
});
*/

app.get('/', (req, res) => {
  res.redirect('/blogs');
});
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});
app.get('/api', (req, res) => {
  res.render('API', { title: 'API', currw: currw });
});
app.use('/blogs', blogRoutes);
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});