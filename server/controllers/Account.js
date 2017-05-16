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

    return response.json({ redirect: '/profile' });
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

  // Added - Makes sure the username is at least 3 characters
  if (request.body.username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters!' });
  }

  // Added - Makes sure the username is not longer than 20 characters
  if (request.body.username.length > 20) {
    return response.status(400).json({ error: 'Username must be less than 20 characters!' });
  }

  // Added - Makes sure the password is at least 3 characters
  if (request.body.pass.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters!' });
  }

  return Account.AccountModel.generateHash(request.body.pass, (salt, hash) => {
    const accountData = {
      username: request.body.username,
      salt,
      password: hash,
      exp: 0,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      request.session.account = Account.AccountModel.toAPI(newAccount);
      return response.json({ redirect: '/profile' });
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

// Allows the user to change their password
// Passwords must be at least 3 characters
const changePassword = (req, res) => {
  if (req.body.pass.length < 3) {
    return res.status(400).json({ error: 'Password must be at least 3 characters!' });
  }

  return Account.AccountModel.generateNewHash(req.session.account.username,
    req.body.pass, (salt, hash) => {
      const accPromise = Account.AccountModel.findOne({ username: req.session.account.username });

      accPromise.then((acc) => {
        const account = acc;

        account.password = hash;

        const passPromise = account.save();

        passPromise.then(() => res.json({ redirect: '/profile' }));

        passPromise.catch((err) => {
          console.log(err);

          return res.status(400).json({ error: 'An error occured!' });
        });
      });


      accPromise.catch((err) => {
        console.log(err);

        return res.status(400).json({ error: 'An error occured!' });
      });
    });
};

// Add exp to the account upon "purchase"
const addExp = (req, res) => {
  const accPromise = Account.AccountModel.findOne({ username: req.session.account.username });

  accPromise.then((acc) => {
    const account = acc;

    account.exp += parseInt(req.body.exp, 10);

    const savePromise = account.save();

    savePromise.then(() => {
      res.json({ redirect: '/profile' });
    });

    savePromise.catch((err) => {
      console.log(err);

      return res.status(400).json({ error: 'An error occured!' });
    });
  });

  accPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured!' });
  });
};

// Subtracts exp from the account upon increasing a stat NOTE: Not currently used
const subExp = (req, res) => {
  const accPromise = Account.AccountModel.findOne({ username: req.session.account.username });

  accPromise.then((acc) => {
    const account = acc;

    account.exp -= parseInt(req.body.exp, 10);

    const savePromise = account.save();

    savePromise.then(() => {
      res.json({ redirect: '/profile' });
    });

    savePromise.catch((err) => {
      console.log(err);

      return res.status(400).json({ error: 'An error occured!' });
    });
  });

  accPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured!' });
  });
};

// Gets the name of the user
const getName = (req, res) => res.json({ name: req.session.account.username });

// Gets the exp of the user
const getExp = (req, res) => res.json({ exp: req.session.account.exp });

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
module.exports.addExp = addExp;
module.exports.subExp = subExp;
module.exports.getName = getName;
module.exports.getExp = getExp;
