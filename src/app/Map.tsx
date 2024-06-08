"use client";
import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
  Circle,
} from "@react-google-maps/api";

interface MapProps {
  foodTrucks: any;
  selectedPlace: any;
  searchLngLat: any;
  currentLocation: any;
}

const Map = (props: MapProps) => {
  const { foodTrucks, selectedPlace, searchLngLat, currentLocation } = props;
  const sanFranciscoCoordinates = { lat: 37.7749, lng: -122.4194 };
  // static lat and lng

  const truckIcon = {
    url: "/truck.png", // Your icon URL
    scaledSize: new window.google.maps.Size(50, 50), // Set the width and height to your desired size
  };
  return (
    <GoogleMap
      zoom={searchLngLat ? 18 : 12}
      center={
        searchLngLat ||
        (foodTrucks[0] && {
          lat: foodTrucks[0]?.location.latitude,
          lng: foodTrucks[0]?.location.longitude,
        }) ||
        sanFranciscoCoordinates
      }
      mapContainerClassName="map"
      mapContainerStyle={{ width: "100vw", height: "100vh", margin: "auto" }}
    >
      {/* Render markers for each food truck */}
      {foodTrucks?.map((truck: any) => (
        <React.Fragment key={truck.id}>
          <Marker
            position={{
              lat: truck.location.latitude,
              lng: truck.location.longitude,
            }}
            icon={truckIcon}
            title={truck.applicant} // Optional: show the applicant name on hover
          />
          <Circle
            center={{
              lat: truck.location.latitude,
              lng: truck.location.longitude,
            }}
            radius={20}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
            }}
          />
        </React.Fragment>
      ))}

      {/* Render a marker for the selected place if any */}
      {searchLngLat && <Marker position={searchLngLat} />}
    </GoogleMap>
  );
};

export default Map;
