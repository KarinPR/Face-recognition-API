const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

const app = express();

app.use(bodyParser.json());
app.use(cors())



app.get('/', (req, res)=> { res.send('Server uploaded successfully') })

app.post('/signin', (req, res) => { signin.handleSignin(req, res, knex, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) });
app.get('/profile/:id' , (req , res) => {profile.handleProfileGet(req, res, knex) });
app.put('/image' , (req, res) => {image.handleImage(req, res, knex)});

app.post('/input' , (req, res) => {image.handleApiCall(req, res)});


const PORT = process.env.PORT
app.listen(PORT || 3000, ()=> {
	console.log(`Server is listening on port ${PORT}`)
})

console.log(PORT)

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user
*/