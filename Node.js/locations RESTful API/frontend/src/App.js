import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./App.css";
const axios = require("axios").default;

class App extends React.Component {
  state = { locations: [] };
  async componentDidMount() {
    let hr = await axios("http://localhost:8080/locations");
    this.setState({ locations: hr.data });
  }

  render() {
    return (
      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        scrollWheelZoom={true}
        whenCreated={(map) => {
          map.on("dblclick", async (e) => {
            await axios.post("http://localhost:8080/locations", {
              latitude: e.latlng.lat,
              longitude: e.latlng.lng,
            });
            this.componentDidMount();
          });
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.state.locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              lat: {location.latitude}, lon: {location.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
}
export default App;
