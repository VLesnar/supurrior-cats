let catRenderer;
let catForm;
let statForm;
let CatFormClass;
let CatListClass;
let adoptRenderer;
let AdoptListClass;
let StatWindow;


const handleCat = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width:'hide"'}, 350);
  
  if($("#catName").val() == '' || $("#adv").val() == '' || $("#agl").val() == '' 
     || $("#int").val() == '' || $("#str").val() == '') {
    handleError("All fields are required!");
    return false;
  }
  
  sendAjax('POST', $("#catForm").attr("action"), $("#catForm").serialize(), function() {
    catRenderer.loadCatsFromServer();
  });
  
  return false;
};

// Sends the stat changes through AJAX using a form
const handleStat = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width:'hide"'}, 350);
  
  if($("#adv").val() == '' || $("#agl").val() == '' 
     || $("#int").val() == '' || $("#str").val() == '') {
    handleError("All fields are required!");
    return false;
  }
  
  sendAjax('POST', $("#statForm").attr("action"), $("#statForm").serialize(), function() {
    catRenderer.loadCatsFromServer();
  });
  
  return false;
};

// Renders the cats available for adoption onscreen; TODO - Get this to display properly
const renderAdoptList = function() {
  return (
    <div>
      <h3>A Cat to Adopt!</h3>
    </div>
  );
};

const renderCat = function() {
  return (
    <form id="catForm"
      onSubmit={this.handleSubmit}
      name="catForm"
      action="/maker"
      method="POST"
      className="catForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="catName" type="text" name="name" placeholder="Cat Name" />
      <label htmlFor="adv">Adventurousness: </label>
      <input id="adv" type="text" name="adv" placeholder="0" />
      <label htmlFor="agl">Agility: </label>
      <input id="agl" type="text" name="agl" placeholder="0" />
      <label htmlFor="int">Intelligence: </label>
      <input id="int" type="text" name="int" placeholder="0" />
      <label htmlFor="str">Stretch: </label>
      <input id="str" type="text" name="str" placeholder="0" />
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="makeCatSubmit" type="submit" value="Make Cat" />
    </form>
  );
};

// Adds the stat change form to the profile page to be changed
const renderStat = (cat) => {
  return (
    <form id="statForm"
      onSubmit={() => handleStat}
      name="statForm"
      action="/stat"
      method="POST"
      className="statForm"
      >
      <h3 className="catName"> Name: {cat.name} </h3>
      <label htmlFor="adv">Adventurousness: </label>
      <input id="adv" type="text" name="adv" placeholder="0" />
      <label htmlFor="agl">Agility: </label>
      <input id="agl" type="text" name="agl" placeholder="0" />
      <label htmlFor="int">Intelligence: </label>
      <input id="int" type="text" name="int" placeholder="0" />
      <label htmlFor="str">Stretch: </label>
      <input id="str" type="text" name="str" placeholder="0" />
      <input className="updateCatSubmit" type="submit" value="Update Cat" />
    </form>
  );
};

// Creates a react class for changing to the stat form
const changeStat = (cat) => {  
  let name = cat.name;
  name =`#${name}`;
  
  statForm = ReactDOM.render(
    <StatWindow />,
    document.querySelector(name)
  )
};

const renderCatList = function() {
  if(this.state.data.length === 0) {
    return (
      <div className="catList">
        <h3 className="emptyCat">No Cats yet!</h3>
      </div>
    );
  }
  
  const catNodes = this.state.data.map(function(cat) {
    return (
      <div key={cat._id} className="cat" id={cat.name} onClick={() => changeStat(cat)}>
        <img src="/assets/img/cat.png" alt="cat" className="catPic" />
        <h3 className="catName"> Name: {cat.name} </h3>
        <h3 className="stat"> Adventurousness: {cat.adventurousness} </h3>
        <h3 className="stat"> Agility: {cat.agility} </h3>
        <h3 className="stat"> Intelligence: {cat.intelligence} </h3>
        <h3 className="stat"> Stretch: {cat.stretch} </h3>
      </div>
    );
  });
  
  return (
    <div className="catList">
      {catNodes}
    </div>
  );
};

const setup = function(csrf) {
  StatWindow = React.createClass({
    render: () => renderStat(cat)
  });
  
  CatFormClass = React.createClass({
    handleSubmit: handleCat,
    render: renderCat,
  });
  
  CatListClass = React.createClass({
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
    render: renderCatList,
  });
  
  // Class made to show cats that can be adopted - TODO move from this because /adopt is trying
  // to read above code causing error
  AdoptListClass = React.createClass({
    render: renderAdoptList,
    getInitialState: function () {
      return {data: []};
    },
  });
  
  catForm = ReactDOM.render(
    <CatFormClass csrf={csrf} />, document.querySelector("#makeCat")
  );
  
  catRenderer = ReactDOM.render(
    <CatListClass />, document.querySelector("#cats")
  );
  
  // Render those cats to the screen!
  adoptRenderer = ReactDOM.render(
    <AdoptListClass />, document.querySelector("#adoptCats")
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});