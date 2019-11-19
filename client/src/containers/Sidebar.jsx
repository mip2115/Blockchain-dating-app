import React, { Component } from "react";
import "./css/sidebar.css";
import { connect } from "react-redux";
import Merchant from "../components/Merchant";
import { fetchMerchants } from "../actions/merchant";

class Sidebar extends Component {
  constructor() {
    super();
    this.renderMerchants = this.renderMerchants.bind(this);
  }

  renderMerchants() {
    const { merchants } = this.props;

    return merchants.map((e, i) => <Merchant addr={e} key={i} />);
  }

  async componentDidMount() {
    await this.props.fetchMerchants();
    console.log("MERCHANTS ARE: ");
    console.log(this.props.merchants);
  }
  render() {
    return <div className="sidebar">{this.renderMerchants()}</div>;
  }
}

const mapStateToProps = state => ({
  merchants: state.merchants,
});
export default connect(mapStateToProps, { fetchMerchants })(Sidebar);
