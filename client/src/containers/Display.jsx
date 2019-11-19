import React, { Component } from "react";
import "./css/display.css";
import { connect } from "react-redux";
import Profile from "../components/Profile";

import { fetchProfiles } from "../actions/profile";

class Display extends Component {
  constructor() {
    super();
    this.renderProfiles = this.renderProfiles.bind(this);
  }

  renderProfiles() {
    return this.props.profiles.map((e, i) => <Profile key={i} addr={e} />);
  }

  async componentDidMount() {}

  render() {
    return <div className="display">{this.renderProfiles()}</div>;
  }
}

const mapStateToProps = state => ({
  profiles: state.profiles,
});
export default connect(mapStateToProps, { fetchProfiles })(Display);
