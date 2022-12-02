require('dotenv').config()

const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000


var pg = require('pg'),
    pgSession = require('connect-pg-simple')(session);


const routes = require('./routes/index')


const pgPool = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});


app.set('view engine', 'ejs')
app.use(session({
    store: new pgSession({
        pool: pgPool, // Use global pg-module
        createTableIfMissing: true, //;Connect using something else than default DATABASE_URL env variable
        tableName: 'user_sessions', // Use another table-name than the default "session" one
    }),
    secret: process.env.FOO_COOKIE_SECRET,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
    res.locals.message = req.flash('message');
    next();
});

app.use('/', routes)
require('./config/passport')(passport)

app.listen(PORT, () => {
    console.log(`Application server started on port: ${PORT}`)
})