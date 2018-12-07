import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>DaHU Technology 无敌</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <ul>
            {[1, 2, 3].map((arr, index) => (
              <li key={index}>{arr}</li>
            ))}
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
