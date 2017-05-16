const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getCats', mid.requiresLogin, controllers.Cat.getCats);
  app.get('/getName', mid.requiresLogin, controllers.Account.getName);
  app.get('/getExp', mid.requiresLogin, controllers.Account.getExp);
  app.post('/updateCat', mid.requiresLogin, controllers.Cat.updateCat);
  app.post('/addCat', mid.requiresLogin, controllers.Cat.addCat);
  app.post('/buyExp', mid.requiresSecure, mid.requiresLogin, controllers.Account.addExp);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.get('/profile', mid.requiresLogin, controllers.Cat.profilePage);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', controllers.Cat.profilePage);
};

module.exports = router;
