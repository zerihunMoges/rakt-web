"use client";
import { Autocomplete } from "@react-google-maps/api";
import React from "react";
interface SearchPlaceProps {
  selectedPlace: any;
  searchLngLat: any;
  currentLocation: any;
  setSelectedPlace: React.Dispatch<React.SetStateAction<any>>;
  setSearchLngLat: React.Dispatch<React.SetStateAction<any>>;
  setCurrentLocation: React.Dispatch<React.SetStateAction<any>>;
}

const SearchPlace = (props: SearchPlaceProps) => {
  const {
    selectedPlace,
    searchLngLat,
    currentLocation,
    setCurrentLocation,
    setSearchLngLat,
    setSelectedPlace,
  } = props;
  const autocompleteRef = React.useRef<null>(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    setSelectedPlace(place);
    setSearchLngLat({
      lat: place?.geometry.location.lat(),
      lng: place?.geometry.location.lng(),
    });
    setCurrentLocation(null);
  };

  return (
    <Autocomplete
      onLoad={(autocomplete) => {
        console.log("Autocomplete loaded:", autocomplete);
        autocompleteRef.current = autocomplete;
      }}
      onPlaceChanged={handlePlaceChanged}
      options={{ fields: ["address_components", "geometry", "name"] }}
      className="w-full"
    >
      <input
        className="text-base text-gray-400 flex-grow outline-none px-2 w-full"
        type="text"
        placeholder="Search location"
        value={
          searchLngLat?.name
            ? searchLngLat.name
            : selectedPlace?.formatted_address
        }
        onChange={(e) => {
          setSearchLngLat({});
        }}
      />
    </Autocomplete>
  );
};

export default SearchPlace;
