const React = require('react');

const ReactDOM = require('react-dom');

//ReactDOM.render(<App />, ...);

const helloWrld = props => {
  return <h1> Oooooooooof {props.name}¡ </h1>
}

ReactDOM.render(<helloWrld name = 'Dummy' />, element)
