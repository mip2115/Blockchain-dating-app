import React, { Component } from "react";
import "./css/profile.css";
import dateApp from "../ethereum/dateApp";
import web3 from "../ethereum/web3";
import aws from "aws-sdk";
import { bucket, accessSecret, accessKey } from "../s3_info";

aws.config.update({
  region: "us-west-1", // Put your aws region here
  accessKeyId: "AKIAI5F2YVNHV7I3UELQ",
  secretAccessKey: "QrrdvVZdY4/7PrCMQM0tntsOcmVNQd+rsSeHC+hG",
});

const addr = "https://www.jumpstarttech.com/files/2018/08/Network-Profile.png";
class Profile extends Component {
  constructor(props) {
    super();

    this.likeProfile = this.likeProfile.bind(this);
    this.findMatches = this.findMatches.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.payProfile = this.payProfile.bind(this);
    this.withdrawProfile = this.withdrawProfile.bind(this);
    this.toggleProfile = this.toggleProfile.bind(this);

    this.state = {
      address: props.addr,
      buttonStatus: "like",
      view: true,
      bio: "",
      placeAddr: "",
      placeName: "",
      age: 0,
      imageURL: "",
      number: "",
    };
  }

  async componentDidMount() {
    const imageURL =
      "https://blockchain-pictures.s3-us-west-1.amazonaws.com/images/" +
      this.props.addr +
      ".jpeg";
    console.log("IMG URL IS: ");
    console.log(imageURL);

    const bio = await dateApp.methods.getBio(this.props.addr).call();
    const placeAddr = await dateApp.methods.getPlace(this.props.addr).call();
    const age = await dateApp.methods.getAge(this.state.address).call();
    //const age = 25;
    const placeName = await dateApp.methods.place_to_string(placeAddr).call();

    this.setState({
      bio: bio,
      placeAddr: placeAddr,
      placeName: placeName,
      imageURL: imageURL,
      age: age,
    });

    this.findMatches();
    setInterval(this.findMatches, 1000);
  }

  toggleProfile() {
    const { view } = this.state;
    this.setState({
      view: !view,
    });
  }

  async getCurrentAddress() {
    let iAm;
    const accounts = await web3.eth.getAccounts();
    let me = accounts[0];
    let selected = web3.currentProvider.selectedAddress;
    for (let i = 0; i < accounts.length; i++) {
      if (me.toLowerCase() === selected) {
        iAm = accounts[i];
      }
    }
    return iAm;
  }

  async findMatches() {
    const accounts = await web3.eth.getAccounts();
    let me = accounts[0];

    const address = this.state.address;
    const isMatch = await dateApp.methods.isMatch(address, me).call();

    const her = await dateApp.methods.profile_map(address).call();
    const didPay = await dateApp.methods.didPay(address, me).call();
    const shePaid = await dateApp.methods.didPay(me, address).call();

    const isLiked = await dateApp.methods.didLike(address, me).call();
    if (didPay && shePaid) {
      this.setState({
        buttonStatus: "locked",
      });
    } else if (didPay) {
      this.setState({
        buttonStatus: "withdraw",
      });
    } else if (isMatch) {
      this.setState({
        buttonStatus: "pay",
      });
    } else if (isLiked) {
      this.setState({
        buttonStatus: "liked",
      });
    }
  }

  async withdrawProfile() {
    const { address } = this.state;
    const accounts = await web3.eth.getAccounts();
    let me = accounts[0];

    try {
      console.log("INITIATING WITHDRAWL...");
      await dateApp.methods.withdraw(address).send({
        from: me,
        gas: "1000000",
      });
      console.log("SUCCESS IN WITHDRAWING");
      this.setState({
        buttonStatus: "pay",
      });
      this.findMatches();
    } catch (err) {
      console.log("FAILED TO WITHDRAW");
    }
  }

  async payProfile() {
    const accounts = await web3.eth.getAccounts();
    let me = accounts[0];

    const { address } = this.state;

    try {
      await dateApp.methods.payDate(address).send({
        from: me,
        value: web3.utils.toWei(".02", "ether"),
      });

      // now make a check to see if she paid as well
      const didPay = await dateApp.methods.didPay(me, address).call();
      if (didPay) {
        const number = await dateApp.methods
          .getNumber(address, accounts[0])
          .call();

        this.setState({
          buttonStatus: "locked",
          number: number,
        });
      } else {
        this.setState({
          buttonStatus: "withdraw",
        });
      }
      this.findMatches();
    } catch (err) {
      console.log("PAYMENT FAILED");
      console.log(err.message);
    }
  }

  async likeProfile() {
    const accounts = await web3.eth.getAccounts();
    let me = accounts[0];

    const { address } = this.state;
    try {
      console.log("Liking...");
      await dateApp.methods.likeProfile(address).send({
        from: me,
        gas: "1000000",
      });
      console.log("Liked complete");
      this.findMatches();
    } catch (err) {
      console.log("FAILED TO LIKE PROFILE");
      console.log(err.message);
    }

    try {
      console.log("isMatch....");
      const isMatch = await dateApp.methods.isMatch(address, me).call();
      console.log("MATCH IS: ");
      console.log(isMatch);

      if (isMatch) {
      }
    } catch (err) {
      console.log("FAILED TO GET MATCH");
      console.log(err.message);
    }
  }

  renderButton() {
    if (this.state.buttonStatus == "locked") {
      return <div className="profileNumber">{this.state.number}</div>; // GET NUMBER
    } else if (this.state.buttonStatus == "like") {
      return (
        <div onClick={this.likeProfile} className="profileLike">
          Like
        </div>
      );
    } else if (this.state.buttonStatus == "liked") {
      return <div className="profileLiked">Liked</div>;
    } else if (this.state.buttonStatus == "pay") {
      return (
        <div onClick={this.payProfile} className="profilePay">
          Pay
        </div>
      );
    } else if (this.state.buttonStatus == "withdraw") {
      return (
        <div onClick={this.withdrawProfile} className="profileWithdraw">
          Withdraw
        </div>
      );
    }
  }
  render() {
    return (
      <div className="profile_">
        <div className="profileImage_">
          <img src={this.state.imageURL} className="profileImage" />
        </div>
        <div style={{ fontSize: "18px" }} className="profileDesc_">
          <div>
            {this.state.bio}

            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              {this.state.placeName}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "18px" }}>{this.state.age}</div>
            <div className="profileAddr_">{this.props.addr}</div>
          </div>
        </div>
        <div className="profileInfo_">{this.renderButton()}</div>
      </div>
    );
  }
}

export default Profile;
