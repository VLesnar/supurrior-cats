// Logs the user in
const handleLogin = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width:'hide'}, 350);
  
  // If the text fields are empty
  if($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty!");
    return false;
  }
  
  // Login
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  
  return false;
};

// Signs up a user
const handleSignup = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width:'hide'}, 350);
  
  // If the text fields are empty
  if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required!");
    return false;
  }
  
  // If the passwords do not match
  if($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match!");
    return false;
  }  
  
  // Signup
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  
  return false;
};

// Displays the login window
const renderLogin = function() {
  return (
    <form id="loginForm" name="loginForm"
      onSubmit={this.handleSubmit}
      action="/login"
      method="POST"
      className="mainForm"
      >
      <h1>Supurrior Cats</h1>
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="Username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="Password" />
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="formSubmit" type="submit" value="Sign In" />
      
    </form>
  );
};

// Displays the signup window
const renderSignup = function() {
  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={this.handleSubmit}
      action="/signup"
      method="POST"
      className="mainForm"
      >
      <h1>Sign Up</h1>
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="Username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="Password" />
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="Retype Password" />
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="formSubmit" type="submit" value="Sign Up" />
    </form>
  );
};

// Creates the login window
const createLoginWindow = function(csrf) {
  const LoginWindow = React.createClass({
    handleSubmit: handleLogin,
    render: renderLogin
  });
  
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Creates the signup window
const createSignupWindow = function(csrf) {
  const SignupWindow = React.createClass({
    handleSubmit: handleSignup,
    render: renderSignup
  });
  
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const setup = function(csrf) {
  // Clicking displays the login window
  const loginButton = document.querySelector("#loginButton");
  // Clicking displays the signup window
  const signupButton = document.querySelector("#signupButton");
  
  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  createLoginWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});