"use strict";

var catRenderer = void 0;
var catForm = void 0;
var statForm = void 0;
var CatFormClass = void 0;
var CatListClass = void 0;
var adoptRenderer = void 0;
var AdoptListClass = void 0;
var StatWindow = void 0;

var handleCat = function handleCat(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: 'hide"' }, 350);

  if ($("#catName").val() == '' || $("#adv").val() == '' || $("#agl").val() == '' || $("#int").val() == '' || $("#str").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  sendAjax('POST', $("#catForm").attr("action"), $("#catForm").serialize(), function () {
    catRenderer.loadCatsFromServer();
  });

  return false;
};

// Sends the stat changes through AJAX using a form
var handleStat = function handleStat(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: 'hide"' }, 350);

  if ($("#adv").val() == '' || $("#agl").val() == '' || $("#int").val() == '' || $("#str").val() == '') {
    handleError("All fields are required!");
    return false;
  }

  sendAjax('POST', $("#statForm").attr("action"), $("#statForm").serialize(), function () {
    catRenderer.loadCatsFromServer();
  });

  return false;
};

// Renders the cats available for adoption onscreen; TODO - Get this to display properly
var renderAdoptList = function renderAdoptList() {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h3",
      null,
      "A Cat to Adopt!"
    )
  );
};

var renderCat = function renderCat() {
  return React.createElement(
    "form",
    { id: "catForm",
      onSubmit: this.handleSubmit,
      name: "catForm",
      action: "/maker",
      method: "POST",
      className: "catForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "catName", type: "text", name: "name", placeholder: "Cat Name" }),
    React.createElement(
      "label",
      { htmlFor: "adv" },
      "Adventurousness: "
    ),
    React.createElement("input", { id: "adv", type: "text", name: "adv", placeholder: "0" }),
    React.createElement(
      "label",
      { htmlFor: "agl" },
      "Agility: "
    ),
    React.createElement("input", { id: "agl", type: "text", name: "agl", placeholder: "0" }),
    React.createElement(
      "label",
      { htmlFor: "int" },
      "Intelligence: "
    ),
    React.createElement("input", { id: "int", type: "text", name: "int", placeholder: "0" }),
    React.createElement(
      "label",
      { htmlFor: "str" },
      "Stretch: "
    ),
    React.createElement("input", { id: "str", type: "text", name: "str", placeholder: "0" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "makeCatSubmit", type: "submit", value: "Make Cat" })
  );
};

// Adds the stat change form to the profile page to be changed
var renderStat = function renderStat(cat) {
  return React.createElement(
    "form",
    { id: "statForm",
      onSubmit: function onSubmit() {
        return handleStat;
      },
      name: "statForm",
      action: "/stat",
      method: "POST",
      className: "statForm"
    },
    React.createElement(
      "h3",
      { className: "catName" },
      " Name: ",
      cat.name,
      " "
    ),
    React.createElement(
      "label",
      { htmlFor: "adv" },
      "Adventurousness: "
    ),
    React.createElement("input", { id: "adv", type: "text", name: "adv", placeholder: "0" }),
    React.createElement(
      "label",
      { htmlFor: "agl" },
      "Agility: "
    ),
    React.createElement("input", { id: "agl", type: "text", name: "agl", placeholder: "0" }),
    React.createElement(
      "label",
      { htmlFor: "int" },
      "Intelligence: "
    ),
    React.createElement("input", { id: "int", type: "text", name: "int", placeholder: "0" }),
    React.createElement(
      "label",
      { htmlFor: "str" },
      "Stretch: "
    ),
    React.createElement("input", { id: "str", type: "text", name: "str", placeholder: "0" }),
    React.createElement("input", { className: "updateCatSubmit", type: "submit", value: "Update Cat" })
  );
};

// Creates a react class for changing to the stat form
var changeStat = function changeStat(cat) {
  var name = cat.name;
  name = "#" + name;

  statForm = ReactDOM.render(React.createElement(StatWindow, null), document.querySelector(name));
};

var renderCatList = function renderCatList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "catList" },
      React.createElement(
        "h3",
        { className: "emptyCat" },
        "No Cats yet!"
      )
    );
  }

  var catNodes = this.state.data.map(function (cat) {
    return React.createElement(
      "div",
      { key: cat._id, className: "cat", id: cat.name, onClick: function onClick() {
          return changeStat(cat);
        } },
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
        { className: "stat" },
        " Adventurousness: ",
        cat.adventurousness,
        " "
      ),
      React.createElement(
        "h3",
        { className: "stat" },
        " Agility: ",
        cat.agility,
        " "
      ),
      React.createElement(
        "h3",
        { className: "stat" },
        " Intelligence: ",
        cat.intelligence,
        " "
      ),
      React.createElement(
        "h3",
        { className: "stat" },
        " Stretch: ",
        cat.stretch,
        " "
      )
    );
  });

  return React.createElement(
    "div",
    { className: "catList" },
    catNodes
  );
};

var setup = function setup(csrf) {
  StatWindow = React.createClass({
    displayName: "StatWindow",

    render: function render() {
      return renderStat(cat);
    }
  });

  CatFormClass = React.createClass({
    displayName: "CatFormClass",

    handleSubmit: handleCat,
    render: renderCat
  });

  CatListClass = React.createClass({
    displayName: "CatListClass",

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
    render: renderCatList
  });

  // Class made to show cats that can be adopted - TODO move from this because /adopt is trying
  // to read above code causing error
  AdoptListClass = React.createClass({
    displayName: "AdoptListClass",

    render: renderAdoptList,
    getInitialState: function getInitialState() {
      return { data: [] };
    }
  });

  catForm = ReactDOM.render(React.createElement(CatFormClass, { csrf: csrf }), document.querySelector("#makeCat"));

  catRenderer = ReactDOM.render(React.createElement(CatListClass, null), document.querySelector("#cats"));

  // Render those cats to the screen!
  adoptRenderer = ReactDOM.render(React.createElement(AdoptListClass, null), document.querySelector("#adoptCats"));
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
