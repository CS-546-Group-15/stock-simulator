const signupRoutes = require('./signup');
const loginRoutes = require('./login');
const privateRoutes = require('./private');
const logoutRoutes = require('./logout');

const constructorMethod = (app) => {
  //use all routes
  app.use('/signup', signupRoutes);
  app.use('/login', loginRoutes);
  app.use('/private', privateRoutes);
  app.use('/logout', logoutRoutes);

  //home route
  app.get('/', async (req, res) => {
      if(req.session.user) res.redirect('/private');
      else res.render('display/login', {});
  });

  //invalid page
  // !!!
  // going to want to make this a 'page not found' page instead of a json response
  // !!!
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
