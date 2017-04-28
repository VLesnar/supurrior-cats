const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const request = req;
  const response = res;

  const username = `${request.body.username}`;
  const password = `${request.body.pass}`;

  if (!username || !password) {
    return response.status(400).json({ error: 'All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return response.status(401).json({ error: 'Wrong username or password!' });
    }

    request.session.account = Account.AccountModel.toAPI(account);

    return response.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  const request = req;
  const response = res;

  request.body.username = `${request.body.username}`;
  request.body.pass = `${request.body.pass}`;
  request.body.pass2 = `${request.body.pass2}`;

  if (!request.body.username || !request.body.pass || !request.body.pass2) {
    return response.status(400).json({ error: 'All fields are required!' });
  }

  if (request.body.pass !== request.body.pass2) {
    return response.status(400).json({ error: 'Passwords do not match!' });
  }

  // Added - Makes sure the username is at least 5 characters
  if (request.body.username.length < 5) {
    return response.status(400).json({ error: 'Username must be at least 5 characters!' });
  }

  // Added - Makes sure the username is not longer than 30 characters
  if (request.body.username.length > 20) {
    return response.status(400).json({ error: 'Username must be less than 20 characters!' });
  }

  // Added - Makes sure the password is at least 6 characters
  if (request.body.pass.length < 6) {
    return response.status(400).json({ error: 'Password must be at least 6 characters!' });
  }

  return Account.AccountModel.generateHash(request.body.pass, (salt, hash) => {
    const accountData = {
      username: request.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      request.session.account = Account.AccountModel.toAPI(newAccount);
      return response.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return response.status(400).json({ error: 'Username already in use!' });
      }

      return response.status(400).json({ error: 'An error occurred!' });
    });
  });
};

const getToken = (req, res) => {
  const request = req;
  const response = res;

  const csrfJSON = {
    csrfToken: request.csrfToken(),
  };

  response.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
