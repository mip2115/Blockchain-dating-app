import React, { Component } from "react";
import dateApp from "../ethereum/dateApp";
import web3 from "../ethereum/web3";
import S3FileUpload, { uploadFile } from "react-s3";

import fs from "fs";
import aws from "aws-sdk";
import "./css/options.css";

const S3_BUCKET = "blockchain-pictures";

const config = {
  bucketName: S3_BUCKET,
  dirName: "images",
  region: "us-west-1",
  accessKeyId: "AKIAI5F2YVNHV7I3UELQ",
  secretAccessKey: "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",
};

class Navbar extends Component {
  constructor() {
    super();
  }

  render() {
    console.log("CURRENT IS: ");
    const { current, tab } = this.props;
    console.log(current);
    return (
      <div className="optionsNav">
        <div
          title="profile"
          onClick={this.props.onClick}
          className={current === "profile" ? "navItemActive" : "navItem"}
        >
          Create
        </div>
        <div className="navItem">Options</div>
        <div
          title="merchant"
          onClick={this.props.onClick}
          className={current === "merchant" ? "navItemActive" : "navItem"}
        >
          Merchant
        </div>
      </div>
    );
  }
}

class CreateLocation extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: "",
      merchant: "",
    };
  }

  async handleSubmit(e) {
    console.log("SUBMITTING");
    e.preventDefault();
    let { name, merchant } = this.state;

    const accounts = await web3.eth.getAccounts();

    console.log(name);
    console.log(merchant);

    try {
      console.log("Creating Location...");
      await dateApp.methods.addPlace(merchant, name).send({
        from: accounts[0],
        gas: "1000000",
      });
      console.log("Location created");
    } catch (err) {
      console.log(err.message);
      console.log("Failed to create Location");
    }
  }

  handleChange(e) {
    console.log("A");
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div className="createProfileContainer">
        <form onSubmit={this.handleSubmit} className="createProfile">
          <label>Name</label>
          <input
            name="name"
            onChange={this.handleChange}
            value={this.state.name}
            placeholder="Mika's Margarine "
          />

          <br />
          <label>Merchant</label>
          <input
            name="merchant"
            value={this.state.merchant}
            onChange={this.handleChange}
            placeholder="0x3b3637FFdeb3..."
          />

          <br />
          <div onClick={this.handleSubmit} className="profileSubmit">
            Submit
          </div>
          <br />
          <div className="optionsErrors"></div>
        </form>
      </div>
    );
  }
}

class CreateProfile extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.state = {
      age: 0,
      number: "",
      merchant: "",
      bio: "",
      address: "",
    };
  }

  async handleSubmit(e) {
    e.preventDefault();
    console.log("UPLOADING...");
    uploadFile(this.state.image, config)
      .then(data => console.log(data))
      .catch(err => console.error(err));

    let { age, number, merchant, bio } = this.state;
    age = parseInt(age);

    const accounts = await web3.eth.getAccounts();

    try {
      console.log("Creating profile...");
      await dateApp.methods.createProfile(age, number, merchant, bio).send({
        from: accounts[0],
        gas: "1000000",
      });
      console.log("Profile created");
    } catch (err) {
      console.log("Failed to create profile");
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      address: accounts[0],
    });
    console.log("ADDRESS IS:");
    console.log(this.state.address);
  }

  onChangeHandler = async event => {
    let file = event.target.files[0];
    let name = this.state.address + ".jpeg"; // TODO – change to accept any file type
    let newFile = new File([file], name, { type: "image/png" });

    await this.setState({
      image: newFile,
    });
    console.log("STATE IMAGE IS NOW");
    console.log(this.state.image);
  };

  render() {
    const { age, number, merchant, bio } = this.state;

    return (
      <div className="createProfileContainer">
        <form onSubmit={this.handleSubmit} className="createProfile">
          <label>Age</label>
          <input
            name="age"
            value={age}
            onChange={this.handleChange}
            placeholder="25.."
          />
          <br />
          <label>Number</label>
          <input
            name="number"
            onChange={this.handleChange}
            value={number}
            placeholder="555-555-5555..."
          />

          <br />
          <label>Merchant</label>
          <input
            onChange={this.handleChange}
            name="merchant"
            value={merchant}
            placeholder="0x3b3637FFdeb3..."
          />

          <br />
          <label>Bio</label>
          <textarea
            onChange={this.handleChange}
            name="bio"
            value={bio}
            rows="6"
            placeholder="Enter a bio..."
          />

          <br />
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={this.onChangeHandler}
          />

          <br />

          <div onClick={this.handleSubmit} className="profileSubmit">
            Submit
          </div>

          <br />
          <div className="optionsErrors"></div>
        </form>
      </div>
    );
  }
}

class Options extends Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    //this.onChangeHandler = this.onChangeHandler.bind(this);
    this.state = {
      display: "profile",
      image: ",",
    };
  }

  onClick(e) {
    const { title } = e.target;

    this.setState({
      display: title,
    });
  }

  render() {
    return (
      <div className="options">
        <Navbar current={this.state.display} onClick={this.onClick} />

        <div>
          {this.state.display == "profile" && <CreateProfile />}
          {this.state.display == "merchant" && <CreateLocation />}
        </div>
      </div>
    );
  }
}

export default Options;
