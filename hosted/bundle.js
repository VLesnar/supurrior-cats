"use strict";

var ChangePasswordForm = void 0;
var BuyExpForm = void 0;

// Update the cat in the database based on which stat to increase
function updateCat(cat, csrf, type) {
  var data = cat;
  data._csrf = csrf;

  switch (type) {
    case "adv":
      data.adventurousness += 1;
      break;
    case "agl":
      data.agility += 1;
      break;
    case "int":
      data.intelligence += 1;
      break;
    case "str":
      data.stretch += 1;
      break;
    default:
      break;
  }

  console.dir(data);
  sendAjax('POST', '/updateCat', data, redirect);
};

// Adopt a cat to add to the profile page and database
function adoptCat(cat, name, csrf) {
  if (name.length < 3) {
    return handleError("Names must be at least 3 characters!");
  }

  var data = cat;

  data.name = name;
  data._csrf = csrf;

  sendAjax('POST', '/addCat', data, redirect);
};

var handlePasswordChange = function handlePasswordChange(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: 'hide' }, 350);

  if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match!");
    return false;
  }

  if ($("#pass").val().length < 3) {
    handleError("Password must be at least 3 characters!");
    return false;
  }

  sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);

  return false;
};

// Allows the user to add exp to their account
var handleBuyExp = function handleBuyExp(e) {
  e.preventDefault();

  sendAjax('POST', $("#buyExpForm").attr("action"), $("#buyExpForm").serialize(), redirect);

  return false;
};

// Creates the password change window
var renderChangePasswordForm = function renderChangePasswordForm() {
  return React.createElement(
    "form",
    { id: "changePasswordForm",
      onSubmit: this.handleSubmit,
      name: "changePasswordForm",
      action: "/changePassword",
      method: "POST"
    },
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "New Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "Password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Retype New Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "Retype Password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
  );
};

// Creates the exp purchase window - Allows the user to choose between different deals
var renderBuyExpForm = function renderBuyExpForm() {
  return React.createElement(
    "form",
    { id: "buyExpForm",
      onSubmit: this.handleSubmit,
      name: "buyExpForm",
      action: "/buyExp",
      method: "POST"
    },
    React.createElement("input", { id: "50", type: "radio", name: "exp", value: "50", defaultChecked: true }),
    React.createElement(
      "label",
      { htmlFor: "50" },
      "50 EXP - $.99"
    ),
    React.createElement("br", null),
    React.createElement("input", { id: "100", type: "radio", name: "exp", value: "100" }),
    React.createElement(
      "label",
      { htmlFor: "100" },
      "100 EXP - $1.99"
    ),
    React.createElement("br", null),
    React.createElement("input", { id: "500", type: "radio", name: "exp", value: "500" }),
    React.createElement(
      "label",
      { htmlFor: "500" },
      "500 EXP - $4.99"
    ),
    React.createElement("br", null),
    React.createElement("input", { id: "1000", type: "radio", name: "exp", value: "1000" }),
    React.createElement(
      "label",
      { htmlFor: "1000" },
      "1000 EXP - $8.99"
    ),
    React.createElement("br", null),
    React.createElement("input", { id: "5000", type: "radio", name: "exp", value: "5000" }),
    React.createElement(
      "label",
      { htmlFor: "5000" },
      "5000 EXP - $12.99"
    ),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Buy Exp" })
  );
};

// Render the users cats to the screen based on what is in the database
var renderProfile = function renderProfile() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "catList" },
      React.createElement(
        "h3",
        { className: "emptyCat" },
        "No Cats yet!",
        React.createElement("br", null),
        "Adopt one at the Adoption Center!"
      )
    );
  }
  var csrf = this.props.csrf;
  var catNodes = this.state.data.map(function (cat) {
    return React.createElement(
      "div",
      { key: cat._id, className: "cat", id: cat.name },
      React.createElement("img", { src: "/assets/img/cat.png", alt: "cat", className: "catPic" }),
      React.createElement(
        "h3",
        { className: "catName" },
        " Name: ",
        cat.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "statMain" },
        " Adventurousness: ",
        cat.adventurousness,
        " "
      ),
      React.createElement(
        "button",
        { className: "statMainButton", onClick: function onClick() {
            return updateCat(cat, csrf, "adv");
          } },
        "Increase Adventurousness!"
      ),
      React.createElement(
        "h3",
        { className: "statMain" },
        " Agility: ",
        cat.agility,
        " "
      ),
      React.createElement(
        "button",
        { className: "statMainButton", onClick: function onClick() {
            return updateCat(cat, csrf, "agl");
          } },
        "Increase Agility!"
      ),
      React.createElement(
        "h3",
        { className: "statMain", id: "int" },
        " Intelligence: ",
        cat.intelligence,
        " "
      ),
      React.createElement(
        "button",
        { className: "statMainButton", onClick: function onClick() {
            return updateCat(cat, csrf, "int");
          } },
        "Increase Intelligence!"
      ),
      React.createElement(
        "h3",
        { className: "statMain" },
        " Stretch: ",
        cat.stretch,
        " "
      ),
      React.createElement(
        "button",
        { className: "statMainButton", onClick: function onClick() {
            return updateCat(cat, csrf, "str");
          } },
        "Increase Stretch!"
      )
    );
  });

  return React.createElement(
    "div",
    { className: "catList" },
    catNodes
  );
};

// Render the adoption center page with 4 randomized cats
// Allows the user to choose a name for the cat that is at least 3 characters
var renderAdopt = function renderAdopt() {
  var _this = this;

  var arr = Object.keys(this.state).map(function (key) {
    return _this.state[key];
  });

  console.log(arr.length);
  var csrf = this.props.csrf;
  var catNodes = arr.map(function (cat) {
    return React.createElement(
      "div",
      { key: cat.id, id: cat.id, className: "cat" },
      React.createElement("img", { src: "/assets/img/cat.png", alt: "cat", className: "catPic" }),
      React.createElement(
        "h3",
        { className: "stat" },
        " Adventurousness: ",
        cat.adv,
        " "
      ),
      React.createElement(
        "h3",
        { className: "stat" },
        " Agility: ",
        cat.agl,
        " "
      ),
      React.createElement(
        "h3",
        { className: "stat" },
        " Intelligence: ",
        cat.int,
        " "
      ),
      React.createElement(
        "h3",
        { className: "stat" },
        " Stretch: ",
        cat.str,
        " "
      ),
      React.createElement("input", { id: "name", type: "text", placeholder: "Give this cat a name!" }),
      React.createElement(
        "button",
        { className: "adoptButton", onClick: function onClick() {
            return adoptCat(cat, $("#name").val(), csrf);
          } },
        "Adopt Cat!"
      )
    );
  });

  return React.createElement(
    "div",
    { className: "catList" },
    catNodes
  );
};

// Creates the profile window class based on the cats in the database
var createProfileWindow = function createProfileWindow(csrf) {
  var ProfileWindow = React.createClass({
    displayName: "ProfileWindow",

    loadCatsFromServer: function loadCatsFromServer() {
      sendAjax('GET', '/getCats', null, function (data) {
        this.setState({ data: data.cats });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadCatsFromServer();
    },
    render: renderProfile
  });

  ReactDOM.render(React.createElement(ProfileWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Creates the exp purchase window class
var createBuyExpForm = function createBuyExpForm(csrf) {
  BuyExpForm = React.createClass({
    displayName: "BuyExpForm",

    handleSubmit: handleBuyExp,
    render: renderBuyExpForm
  });

  ReactDOM.render(React.createElement(BuyExpForm, { csrf: csrf }), document.querySelector("#content"));
};

// Creates the change password window class
var createChangePasswordForm = function createChangePasswordForm(csrf) {
  ChangePasswordForm = React.createClass({
    displayName: "ChangePasswordForm",

    handleSubmit: handlePasswordChange,
    render: renderChangePasswordForm
  });

  ReactDOM.render(React.createElement(ChangePasswordForm, { csrf: csrf }), document.querySelector("#content"));
};

// Creates 4 random cats with random stats the user can adopt
// Has no name - User enters before adopting
var createRandomCats = function createRandomCats() {
  var cats = {};

  for (var i = 0; i < 4; i++) {
    var cat = {};

    var d = new Date();
    cat.id = d.getTime() * Math.floor(Math.random() * 100000 + 1);
    cat.adv = randomValue();
    cat.agl = randomValue();
    cat.int = randomValue();
    cat.str = randomValue();

    cats[cat.id] = cat;
  };

  return cats;
};

// Creates the adoption window class
var createAdoptWindow = function createAdoptWindow(csrf) {
  var AdoptWindow = React.createClass({
    displayName: "AdoptWindow",

    render: renderAdopt,
    getInitialState: function getInitialState() {
      var data = createRandomCats();
      return data;
    },
    loadCatsFromServer: function loadCatsFromServer() {
      sendAjax('GET', '/getCats', null, function (data) {
        this.setState({ data: data.cats });
      }.bind(this));
    },
    csrf: csrf
  });

  ReactDOM.render(React.createElement(AdoptWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Gets the name of the user to display
var getName = function getName() {
  sendAjax('GET', '/getName', null, function (data) {
    name = data.name;
    return name;
  });
};

// Gets the exp of the user to display NOTE: Is not finding the right thing
var getExp = function getExp() {
  sendAjax('GET', '/getExp', null, function (data) {
    console.dir(this);
    if (data.exp === 0) {
      exp = 0;
    } else {
      exp = data.exp;
    }
    return exp;
  });
};

// Renders a bar at the top of the page to show username and exp
var renderWelcomeBar = function renderWelcomeBar() {
  return React.createElement(
    "h1",
    null,
    "Welcome ",
    name,
    "! You have ",
    this.exp,
    " experience points!"
  );
};

var setup = function setup(csrf) {
  var WelcomeBar = React.createClass({
    displayName: "WelcomeBar",

    name: getName,
    exp: getExp,
    render: renderWelcomeBar
  });

  ReactDOM.render(React.createElement(WelcomeBar, { csrf: csrf }), document.querySelector("#welcome"));

  // Buttons to switch between displays
  var profileButton = document.querySelector("#profileButton");
  var passButton = document.querySelector("#passButton");
  var buyButton = document.querySelector("#buyButton");
  var adoptButton = document.querySelector("#adoptButton");

  profileButton.addEventListener("click", function (e) {
    e.preventDefault();
    createProfileWindow(csrf);
    return false;
  });

  passButton.addEventListener("click", function (e) {
    e.preventDefault();
    createChangePasswordForm(csrf);
    return false;
  });

  buyButton.addEventListener("click", function (e) {
    e.preventDefault();
    createBuyExpForm(csrf);
    return false;
  });

  adoptButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAdoptWindow(csrf);
    return false;
  });

  createProfileWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// Used to get a random value for the cat in the adoption center
var randomValue = function randomValue() {
  return Math.floor(Math.random() * 4 + 1);
};

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#catMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#catMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
