const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthCookie',
    secret: "This cookie will bless you with 100 years of luck, DogeCoin to the mooooon...",
    saveUninitialized: true,
    resave: false
    // cookie: { maxAge: 60000 }
  })
);

app.use(async (req, res, next) => {
  let authMess = "(Non-Authenticated User)";
  if(req.session.user){
    authMess = "(Authenticated User)";
  } 
  console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} ${authMess}`);
  next();
});


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
