import React, { Component } from 'react';
import './App.css';
import {Route} from "react-router";
import Api from "./components/Api";
import {HashRouter} from "react-router-dom";

class App extends Component {

  render() {
    return (
      <HashRouter>
        <Route path="/api" component={Api}/>
      </HashRouter>
    );
  }
}

export default App;
