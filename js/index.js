// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var state = {}

var TypeToggle = React.createClass({
  render: function() {
    const type = this.props.type || "total";
    return (<div>{type}</div>)
  }
});
    
ReactDOM.render(
  <TypeToggle />,
  document.getElementById('app')
);

