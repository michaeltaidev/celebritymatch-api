const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
}});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('Connected to Celebrity Match API.') })
app.post('/login', (req, res) => { login.handleLogin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, db) })
app.put('/image', (req, res) => { image.incrementSubmittedEntries(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) })
app.post('/imagematch', (req, res) => { image.googleImageSearch(req, res) })

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`App is running on port ${process.env.PORT}`);
})