"use client";
import Image from "next/image";
import Map from "./Map";
import { useEffect, useState, useTransition } from "react";
import SearchPlace from "./SearchPlace";
import { useLoadScript } from "@react-google-maps/api";
import { IoLocation } from "react-icons/io5";

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [searchLngLat, setSearchLngLat] = useState<any>({
    long: -122.4194155,
    lat: 37.7749295,
    name: "San Francisco, CA, USA",
  });
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>();
  const [selectedFacility, setSelectedFacility] = useState<any>();
  const radius = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
  const [searchRadius, setSearchRadius] = useState<any>(radius[0]);
  const [getFoodTrucksPending, startGetFoodTrucks] = useTransition();
  const [foodTrucks, setFoodTrucks] = useState<any>([]);
  // laod script for google map
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    // Fetch data from NEXT_PUBLIC_BACKEND when location or status changes
    const fetchData = async () => {
      startGetFoodTrucks(async () => {
        try {
          // Initialize URL with base path
          const url = new URL(process.env.NEXT_PUBLIC_BACKEND + "/foodtrucks");

          // Create a URLSearchParams object to handle query parameters
          const params = new URLSearchParams();

          // Add location parameters if available
          if (selectedPlace) {
            params.append("long", searchLngLat?.lng);
            params.append("lat", searchLngLat?.lat);
          }

          // Add status parameter if available
          if (selectedStatus) {
            params.append("status", selectedStatus);
          }
          if (selectedFacility) {
            params.append("facilityType", selectedFacility);
          }
          if (searchRadius) {
            params.append("searchRadius", searchRadius.toString());
          }

          // Append the constructed query string to the URL
          url.search = params.toString();

          const response = await fetch(url.toString());
          const data = await response.json();

          // Process the fetched data here
          setFoodTrucks(data.results);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      });
    };

    fetchData();
  }, [selectedPlace, selectedStatus, selectedFacility]);
  if (!isLoaded)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
      </div>
    );
  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedPlace(null);
          setSearchLngLat({
            lat: latitude,
            lng: longitude,
            name: "Your Location",
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const statuses = ["APPROVED", "SUSPENDED", "REQUESTED", "EXPIRED"];
  const facility_type = ["Truck", "Push Cart"];

  return (
    <div className="relative bg-gray-100 flex justify-center items-center">
      <Map
        currentLocation={currentLocation}
        selectedPlace={selectedPlace}
        searchLngLat={searchLngLat}
        foodTrucks={foodTrucks || []}
      />
      <div className="absolute top-[10%] left-[10%] right-[10%] bg-indigo-500 bg-opacity-70 backdrop-blur-sm rounded-lg p-14">
        <form>
          <h1 className="text-center font-bold text-white text-3xl">
            World Needs More Food Trucks!
          </h1>
          <p className="mx-auto font-normal text-sm my-3 max-w-lg">
            Search a Location or Use your current location to find food trucks!
          </p>
          <div className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
            <div>
              <div
                onClick={handleGetLocationClick}
                className="cursor-pointer hover:bg-indigo-300 rounded-full w-8 h-8 p-1 flex items-center justify-center bg-indigo-500 text-white"
              >
                <IoLocation />
              </div>
            </div>

            <SearchPlace
              searchLngLat={searchLngLat}
              selectedPlace={selectedPlace}
              setCurrentLocation={setCurrentLocation}
              setSearchLngLat={setSearchLngLat}
              setSelectedPlace={setSelectedPlace}
              currentLocation={currentLocation}
            />
            <div className="flex items-center px-2 rounded-lg space-x-4 mx-auto ">
              <div className="flex space-x-1 items-center">
                <span className="text-sm text-gray-400 pl-1 font-normal">
                  Status
                </span>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-base text-gray-800 outline-none border-2 px-2 py-2 rounded-lg"
                >
                  <option selected>All</option>

                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.toLocaleLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-1 items-center">
                <span className="text-sm text-gray-400 pl-1 font-normal">
                  Facility
                </span>
                <select
                  id="facility"
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="text-base text-gray-800 outline-none border-2 px-2 py-2 rounded-lg"
                >
                  <option selected>All</option>

                  {facility_type.map((status) => (
                    <option key={status} value={status}>
                      {status.toLocaleLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-1 items-center">
                <span className="text-sm text-gray-400 pl-1 font-normal">
                  Radius
                </span>
                <select
                  id="radius"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className="text-base text-gray-800 outline-none border-2 px-2 py-2 rounded-lg"
                >
                  {radius.map((status, index) => (
                    <option key={status} value={status}>
                      {status.toLocaleString() + " m"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
