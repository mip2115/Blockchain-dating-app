import React, { Component } from "react";

import "./App.css";
import Sidebar from "./containers/Sidebar";
import Options from "./containers/Options";

import { connect } from "react-redux";
import { setAlert } from "./actions/alert";
import { fetchProfiles } from "./actions/profile";

import Display from "./containers/Display";

const Header = () => <div className="header">[]––BlockDate––[]––[]––</div>;

class App extends Component {
  constructor() {
    super();
    this.createAlert = this.createAlert.bind(this);
  }

  createAlert() {
    console.log("PRESSED");
    this.props.setAlert("MSG", "DANGER");
  }

  async componentDidMount() {
    this.props.fetchProfiles();
  }

  diplayProfiles = items => {};

  render() {
    return (
      <div className="App">
        <Header />
        <br />
        <div className="mainDisplay">
          <Options />
          <Display />
          <Sidebar />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  alerts: state.alert,
  profiles: state.profiles,
});
export default connect(mapStateToProps, { setAlert, fetchProfiles })(App);
