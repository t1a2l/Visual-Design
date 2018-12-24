import React, { Component } from "react";
import "./App.css";
import Select from "./components/Select";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import Geocode from "react-geocode";

class App extends Component {
  state = {
    companyName: "",
    companyAddress: "",
    latitude: "0",
    longitude: "0"
  };
  getAddress = (companyObject, city) => {
    this.setState(
      {
        companyName: companyObject.name,
        companyAddress: companyObject.address + ", " + city
      },
      () => {
        this.showMap();
      }
    );
  };

  showMap = e => {
    Geocode.setApiKey("Put your API key here");
    Geocode.fromAddress(this.state.companyAddress).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          latitude: lat,
          longitude: lng
        });
      },
      error => {
        console.error(error);
      }
    );
  };

  render() {
    const mapStyle = {
      width: "300px",
      height: "200px",
      marginTop: "20px"
    };

    return (
      <div className="App">
        <Select
          getAddress={this.getAddress}
          style={{
            display: "flex"
          }}
        />
        <div className="mapDivStyle">
          <label className="mapLabelStyle">Map</label>
          <hr className="lineStyle" />
          <Map
            className="miniMap"
            google={this.props.google}
            zoom={18}
            style={mapStyle}
            center={{
              lat: this.state.latitude,
              lng: this.state.longitude
            }}
          >
            <Marker
              title={this.state.companyName}
              position={{
                lat: this.state.latitude,
                lng: this.state.longitude
              }}
            />
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "Put your API key here"
})(App);
