import React from "react";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { carList } from "../../data/carList";
import { database } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const RideSelector = (props) => {
  const [rideDuration, setRideDuration] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCarIndex, setSelectedCarIndex] = useState(-1);

  useEffect(() => {
    const pickupCoord = props.pickupCoordinate;
    const dropoffCoord = props.dropoffCoordinate;

    if (pickupCoord && dropoffCoord) {
      rideDurationf(props);
    }
  }, [props]);

  const rideDurationf = (props) => {
    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${props.pickupCoordinate[0]},${props.pickupCoordinate[1]};${props.dropoffCoordinate[0]},${props.dropoffCoordinate[1]}?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoiYWpheTEwMjkiLCJhIjoiY2xncTNjaWh5MHhqZzNmanNqeWh3dnV6cSJ9.MITCgCxz-QrO7YY40uUCww",
        })
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.routes[0]) {
          setRideDuration(data.routes[0].duration / 100);
        }
      });
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAvailableForSharing, setIsAvailableForSharing] = useState(false);
  const dbInstance = collection(database, "bookings");
  const router = useRouter();
  const { pickuplocation, dropofflocation } = router.query;

  const handleConfirm = () => {
    if (selectedCar) {
      const data = {
        from: pickuplocation,
        to: dropofflocation,
        time: new Date(),
        service: selectedCar.service,
        price: selectedCar.price,
        sharing: isAvailableForSharing,
        passengers: 1,
        img: selectedCar.img,
      };
      addDoc(dbInstance, data)
        .then(() => {
          props.setChanged(!props.changed)
          setIsPopupOpen(true);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    router.push('/')
  };

  const handleCheckboxChange = (event) => {
    setIsAvailableForSharing(event.target.checked);
  };

  return (
    <>
      {/* <Title>Choose a ride, or swipe up for more</Title> */}
      <CarList>
        {carList.map((car, index) => (
          <Car
            key={index}
            onClick={() => {
              setSelectedCar({
                img: car.imgUrl,
                service: car.service,
                price: rideDuration * car.multiplier.toFixed(2),
              });
              setSelectedCarIndex(index);
            }}
            isSelected={selectedCarIndex === index}
          >
            <CarImage src={car.imgUrl} />
            <CarDetails>
              <Service>{car.service}</Service>
              <Time>{car.away} min away</Time>
            </CarDetails>
            <CarPrice>
              <span>&#x20B9;</span> {(rideDuration * car.multiplier).toFixed(2)}
            </CarPrice>
          </Car>
        ))}
      </CarList>
      <div>
        <CheckboxContainer>
          <input
            type="checkbox"
            id="availableForSharing"
            checked={isAvailableForSharing}
            onChange={handleCheckboxChange}
          />
          <CheckboxLabel htmlFor="availableForSharing">
            Available for sharing
          </CheckboxLabel>
        </CheckboxContainer>
        <ConfirmButtonContainer onClick={handleConfirm}>
          Book My Cab
        </ConfirmButtonContainer>
        {isPopupOpen && (
          <Popup>
            <p>Your Cab is booked successfully !</p>
            <Button onClick={handlePopupClose}>Close</Button>
          </Popup>
        )}
      </div>
    </>
  );
};

const Wrapper = tw.div`
 flex-1  overflow-y-scroll flex flex-col flex flex-col
`;
const ConfirmButtonContainer = tw.div`
bg-black flex text-xl  items-center py-4 text-white mt-4 justify-center text-center m-4 transform hover: transition cursor-pointer  px-4 py-2  rounded-md

`;
const Title = tw.div`
text-center text-s text-gray-500 border-b m-0
`;

const Popup = tw.div`
  fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  bg-white rounded-md shadow-lg p-4 max-w-sm w-full text-center
`;

const Button = tw.button`
  px-4 py-2 bg-black text-white rounded-md mt-3
`;

const CheckboxContainer = tw.div`
  flex
  items-center
  mb-1
  ml-5
  mt-2
`;

const CheckboxLabel = tw.label`
  ml-2
`;

const Car = tw.div`
  flex items-center
  transition-colors duration-300
  cursor-pointer

  ${(props) => (props.isSelected ? "bg-gray-300" : "hover:bg-gray-100")}

`;

const CarList = tw.div`
border-b  flex flex-col
`;

const CarImage = tw.img`
  h-20 px-4
`;

const CarDetails = tw.div`
  flex-1 px-8
`;

const Service = tw.div`
   font-semibold
`;

const Time = tw.div`
   text-blue-500 text-xs
`;

const CarPrice = tw.div`
px-4 text-sm
`;
export default RideSelector;
