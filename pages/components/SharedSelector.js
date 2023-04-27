import React, { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { database } from "../../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import tw from "tailwind-styled-components";
import { Tag } from "@chakra-ui/react";
import { useRouter } from "next/router";

const SharedSelector = ({
  pickuplocation,
  dropofflocation,
  changed,
  setChanged,
}) => {
  const dbInstance = collection(database, "bookings");
  const router = useRouter();

  const [carList, setCarList] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCarIndex, setSelectedCarIndex] = useState(-1);



  const fetchData = async () => {
    const data = await getDocs(dbInstance).then((response) =>
      response.docs.map((item) => ({ ...item.data(), id: item.id }))
    );
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const sharedData = data.filter(
      (item) =>
        item.sharing === true &&
        item.passengers < 4 &&
        item.from && item.to &&
        item.from.toUpperCase() === pickuplocation.toUpperCase() &&
        item.to.toUpperCase() === dropofflocation.toUpperCase() &&
        currentTime - item.time.toDate().getTime() <= TWO_HOURS
    );

    setCarList(sharedData);
  };

  useEffect(() => {
    fetchData();
    console.log(carList);
  }, [changed]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    router.push("/");
  };

  const handleConfirm = () => {
    if (selectedCar) {
      const docToUpdate = doc(database, "bookings", selectedCar.id);
      const updatedCar = {
        ...selectedCar,
        passengers: selectedCar.passengers + 1,
      };
      delete updatedCar.id;
      updateDoc(docToUpdate, updatedCar)
        .then(() => {
          setChanged(!changed);
          setIsPopupOpen(true);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  return (
    <>
      <CarList>
        {carList &&
          carList.map((car, index) => (
            <Car
              key={index}
              onClick={() => {
                setSelectedCar(car);
                setSelectedCarIndex(index);
              }}
              isSelected={selectedCarIndex === index}
            >
              <CarImage src={car.img} />
              <CarDetails>
                <Service>{car.service}</Service>
                <PlaceName>
                  {car.from.toUpperCase()} → {car.to.toUpperCase()}
                </PlaceName>
              </CarDetails>
              <CarSlots>
                <Tag
                  size="sm"
                  variant="solid"
                  colorScheme={car.passengers === 3 ? "red" : "teal"}
                >
                  {"Slots left: " +
                    (typeof car.passengers === "number"
                      ? 4 - car.passengers
                      : "N/A")}
                </Tag>
              </CarSlots>
            </Car>
          ))}
            {carList && carList.length === 0 && <div style={{ paddingLeft: '30px', marginBottom: '20px', }}>No shared cabs found !</div>}


      </CarList>
      <ConfirmButtonContainer onClick={handleConfirm}>
        Confirm My Ride
      </ConfirmButtonContainer>
      {isPopupOpen && (
        <Popup>
          <p>Your Ride is confirmed !</p>
          <Button onClick={handlePopupClose}>Close</Button>
        </Popup>
      )}
    </>
  );
};

const ConfirmButtonContainer = tw.div`
bg-black flex text-xl  items-center py-4 text-white mt-4 justify-center text-center m-4 transform hover: transition cursor-pointer  px-4 py-2  rounded-md

`;

const Popup = tw.div`
  fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  bg-white rounded-md shadow-lg p-4 max-w-sm w-full text-center
`;

const Button = tw.button`
  px-4 py-2 bg-black text-white rounded-md mt-3
`;

const CarSlots = tw.div`
px-4 text-sm
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

const CarDetails = tw.div`
  flex-1 px-8
`;

const Service = tw.div`
  font-semibold
`;

const PlaceName = tw.div`
  text-green-500 text-xs py-2 font-semibold
`;
const CarImage = tw.img`
  h-20 px-4
`;

export default SharedSelector;
