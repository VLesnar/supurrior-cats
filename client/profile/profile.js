let ChangePasswordForm;
let BuyExpForm;

// Update the cat in the database based on which stat to increase
function updateCat(cat, csrf, type) {  
  let data = cat;
  data._csrf = csrf;
  
  switch(type) {
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
function adoptCat (cat, name, csrf) {
  if(name.length < 3) {
    return handleError("Names must be at least 3 characters!");
  }
  
  let data = cat;
  
  data.name = name;  
  data._csrf = csrf;
  
  sendAjax('POST', '/addCat', data, redirect);
}; 

const handlePasswordChange = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width:'hide'}, 350);
  
  if($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required!");
    return false;
  }
  
  if($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match!");
    return false;
  }
  
  if($("#pass").val().length < 3) {
    handleError("Password must be at least 3 characters!");
    return false;
  }

  sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);
  
  return false;
};

// Allows the user to add exp to their account
const handleBuyExp = (e) => {
  e.preventDefault();
  
  sendAjax('POST', $("#buyExpForm").attr("action"), $("#buyExpForm").serialize(), redirect);
  
  return false;
};

// Creates the password change window
const renderChangePasswordForm = function() {
  return (
    <form id="changePasswordForm"
      onSubmit={this.handleSubmit}
      name="changePasswordForm"
      action="/changePassword"
      method="POST"
      >
      <label htmlFor="pass">New Password: </label>
      <input id="pass" type="password" name="pass" placeholder="Password" />
      <label htmlFor="pass2">Retype New Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="Retype Password" />
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="formSubmit" type="submit" value="Change Password" />
    </form>
  );
};

// Creates the exp purchase window - Allows the user to choose between different deals
const renderBuyExpForm = function() {
  return (
    <form id="buyExpForm"
      onSubmit={this.handleSubmit}
      name="buyExpForm"
      action="/buyExp"
      method="POST"
      >
      <input id="50" type="radio" name="exp" value="50" defaultChecked />
      <label htmlFor="50">50 EXP - $.99</label>
      
      <br></br><input id="100" type="radio" name="exp" value="100" />
      <label htmlFor="100">100 EXP - $1.99</label>
      
      <br></br><input id="500" type="radio" name="exp" value="500" />
      <label htmlFor="500">500 EXP - $4.99</label>
      
      <br></br><input id="1000" type="radio" name="exp" value="1000" />
      <label htmlFor="1000">1000 EXP - $8.99</label>
      
      <br></br><input id="5000" type="radio" name="exp" value="5000" />
      <label htmlFor="5000">5000 EXP - $12.99</label>
      
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="formSubmit" type="submit" value="Buy Exp" />
    </form>
  );
};

// Render the users cats to the screen based on what is in the database
const renderProfile = function() {  
  if(this.state.data.length === 0) {
    return (
      <div className="catList">
        <h3 className="emptyCat">No Cats yet!<br></br>Adopt one at the Adoption Center!</h3>
      </div>
    );
  }
  let csrf = this.props.csrf;
  const catNodes = this.state.data.map(function(cat) {
    return (
      <div key={cat._id} className="cat" id={cat.name}>
        <img src="/assets/img/cat.png" alt="cat" className="catPic" />
        <h3 className="catName"> Name: {cat.name} </h3>
        <h3 className="statMain"> Adventurousness: {cat.adventurousness} </h3>
        <button className="statMainButton" onClick={() => updateCat(cat, csrf, "adv")}>Increase Adventurousness!</button> 
        <h3 className="statMain"> Agility: {cat.agility} </h3>
        <button className="statMainButton" onClick={() => updateCat(cat, csrf, "agl")}>Increase Agility!</button>
        <h3 className="statMain" id="int"> Intelligence: {cat.intelligence} </h3>
        <button className="statMainButton" onClick={() => updateCat(cat, csrf, "int")}>Increase Intelligence!</button>
        <h3 className="statMain"> Stretch: {cat.stretch} </h3>
        <button className="statMainButton" onClick={() => updateCat(cat, csrf, "str")}>Increase Stretch!</button>
      </div>
    );
  });
  
  return (
    <div className="catList">
      {catNodes}
    </div>
  );
};

// Render the adoption center page with 4 randomized cats
// Allows the user to choose a name for the cat that is at least 3 characters
const renderAdopt = function() {
  let arr = Object.keys(this.state).map(key => this.state[key]);
  
  console.log(arr.length);
  let csrf = this.props.csrf
  const catNodes = arr.map(function(cat) {
    return (
      <div key={cat.id} id={cat.id} className="cat">
        <img src="/assets/img/cat.png" alt="cat" className="catPic" />
        <h3 className="stat"> Adventurousness: {cat.adv} </h3>
        <h3 className="stat"> Agility: {cat.agl} </h3>
        <h3 className="stat"> Intelligence: {cat.int} </h3>
        <h3 className="stat"> Stretch: {cat.str} </h3>
        <input id="name" type="text" placeholder="Give this cat a name!"></input>
        <button className="adoptButton" onClick={() => adoptCat(cat, $("#name").val(), csrf)}>Adopt Cat!</button>
      </div>
    );
  });
  
  return (
    <div className="catList">
      {catNodes}
    </div>
  );
};

// Creates the profile window class based on the cats in the database
const createProfileWindow = function(csrf) {
  const ProfileWindow = React.createClass({
    loadCatsFromServer: function() {
      sendAjax('GET', '/getCats', null, function(data) {
        this.setState({data:data.cats});
      }.bind(this));
    },
    getInitialState: function () {
      return {data: []};
    },
    componentDidMount: function () {
      this.loadCatsFromServer();
    },
    render: renderProfile,
  });
  
  ReactDOM.render(
    <ProfileWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Creates the exp purchase window class
const createBuyExpForm = function(csrf) {
  BuyExpForm = React.createClass({
    handleSubmit: handleBuyExp,
    render: renderBuyExpForm,  
  });
  
  ReactDOM.render(
    <BuyExpForm csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Creates the change password window class
const createChangePasswordForm = function(csrf) {
  ChangePasswordForm = React.createClass({
    handleSubmit: handlePasswordChange,
    render: renderChangePasswordForm,  
  });
  
  ReactDOM.render(
    <ChangePasswordForm csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Creates 4 random cats with random stats the user can adopt
// Has no name - User enters before adopting
const createRandomCats = () => {
  let cats = {};
  
  for (let i = 0; i < 4; i++) {
    let cat = {};
    
    let d = new Date();
    cat.id = d.getTime() * Math.floor((Math.random() * 100000) + 1);
    cat.adv = randomValue();
    cat.agl = randomValue();
    cat.int = randomValue();
    cat.str = randomValue();
    
    cats[cat.id] = cat;
  };
  
  return cats;
};

// Creates the adoption window class
const createAdoptWindow = function(csrf) {
  const AdoptWindow = React.createClass({
    render: renderAdopt,
    getInitialState: function () {
      let data = createRandomCats();    
      return data;
    },
    loadCatsFromServer: function loadCatsFromServer() {
      sendAjax('GET', '/getCats', null, function (data) {
        this.setState({ data: data.cats });
      }.bind(this));
    },
    csrf: csrf,
  });
  
  ReactDOM.render(
    <AdoptWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Gets the name of the user to display
const getName = function () {
  sendAjax('GET', '/getName', null, function (data) {
    name = data.name;
    return name;
  });
};

// Gets the exp of the user to display NOTE: Is not finding the right thing
const getExp = function () {
  sendAjax('GET', '/getExp', null, function (data) {
    console.dir(this);
    if(data.exp === 0) {
      exp = 0;
    } else {
      exp = data.exp;
    }
    return exp;
  });
};

// Renders a bar at the top of the page to show username and exp
const renderWelcomeBar = function() {
  return (
    <h1>Welcome {name}! You have {this.exp} experience points!</h1>
  );
};

const setup = function(csrf) {  
  const WelcomeBar = React.createClass({
    name: getName,
    exp: getExp,
    render: renderWelcomeBar,
  });
  
  ReactDOM.render(
    <WelcomeBar csrf={csrf} />,
    document.querySelector("#welcome")
  );
  
  // Buttons to switch between displays
  const profileButton = document.querySelector("#profileButton");
  const passButton = document.querySelector("#passButton");
  const buyButton = document.querySelector("#buyButton");
  const adoptButton = document.querySelector("#adoptButton");
  
  profileButton.addEventListener("click", (e) => {
    e.preventDefault();
    createProfileWindow(csrf);
    return false;
  });
  
  passButton.addEventListener("click", (e) => {
    e.preventDefault();
    createChangePasswordForm(csrf);
    return false;
  });
  
  buyButton.addEventListener("click", (e) => {
    e.preventDefault();
    createBuyExpForm(csrf);
    return false;
  });
  
  adoptButton.addEventListener("click", (e) => {
    e.preventDefault();
    createAdoptWindow(csrf);
    return false;
  });
  
  createProfileWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});

