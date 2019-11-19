import React, { Component } from "react";
import "./css/merchant.css";
import dateApp from "../ethereum/dateApp";
import web3 from "../ethereum/web3";

class Merchant extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      addr: "",
      balance: 0,
    };

    this.checkBalance = this.checkBalance.bind(this);
  }

  async checkBalance() {
    let bal = await web3.eth.getBalance(this.state.addr);
    bal = await web3.utils.fromWei(bal, "ether");

    if (bal != this.state.balance) {
      console.log("NEW BALANCE IS: ");
      console.log(bal);
      this.setState({
        balance: bal,
      });
    }
  }

  async componentDidMount() {
    const { addr } = this.props;
    const name = await dateApp.methods.place_to_string(addr).call();

    this.setState({
      name: name,
      addr: addr,
    });

    setInterval(this.checkBalance, 1000);
  }

  render() {
    const { name, addr, balance } = this.state;
    return (
      <div className="merchant">
        <div className="merchantName">
          <div>{name}</div>
          <div>{balance} ETH</div>
        </div>
        <div className="merchantAddr">{addr}</div>
      </div>
    );
  }
}

export default Merchant;
