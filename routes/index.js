const signupRoutes = require('./signup');
const loginRoutes = require('./login');
const privateRoutes = require('./private');
const logoutRoutes = require('./logout');
const accountRoutes = require('./account');
const discussionRoutes = require('./discussion');
const portfolioRoutes = require('./portfolio');

const data = require('../data');
const userData = data.users;

const constructorMethod = (app) => {
  //  use all routes
  app.use('/signup',      signupRoutes    );
  app.use('/login',       loginRoutes     );
  app.use('/private',     privateRoutes   );
  app.use('/logout',      logoutRoutes    );
  app.use('/account',     accountRoutes   );
  app.use('/discussion',  discussionRoutes);
  app.use('/portfolio',   portfolioRoutes );

  //  home route
  app.get('/', async (req, res) => {
      if(req.session.user) {
        res.redirect('/private');
      } else {
        const users = await userData.getAllUsers();
        res.render('display/landing', {users: users});
      }
  });

 //redirected to not found page
  app.use("*", (req, res) => {
    res.status(404).render('error/notfound', {error: "Not found" });
  });
};

module.exports = constructorMethod;
