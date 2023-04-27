import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import Map from "./components/Map";
import Link from "next/link";
import { useRouter } from "next/router";
import RideSelector from "./components/RideSelector";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import SharedSelector from "./components/SharedSelector";

const Confirm = () => {
  const router = useRouter();
  const { pickuplocation, dropofflocation } = router.query;
  const [pickupCoordinate, setPickupCoordinate] = useState([
    -77.052256, 38.924735,
  ]);
  const [dropoffCoordinate, setDropoffCoordinate] = useState([
    -77.1703, 38.8407,
  ]);
  const [changed, setChanged] = useState(true);

  const getPickupCoordinate = (pickuplocation) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickuplocation}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoiYWpheTEwMjkiLCJhIjoiY2xncTNjaWh5MHhqZzNmanNqeWh3dnV6cSJ9.MITCgCxz-QrO7YY40uUCww",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setPickupCoordinate(data.features[0].center);
      });
  };

  const getDropoffCoordinate = (dropofflocation) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${dropofflocation}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoiYWpheTEwMjkiLCJhIjoiY2xncTNjaWh5MHhqZzNmanNqeWh3dnV6cSJ9.MITCgCxz-QrO7YY40uUCww",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setDropoffCoordinate(data.features[0].center);
      });
  };

  useEffect(() => {
    getPickupCoordinate(pickuplocation);
    getDropoffCoordinate(dropofflocation);
  }, [pickuplocation, dropofflocation]);

  return (
    <Wrapper>
      <ButtonContainer>
        <Link href="/search" passHref>
          <BackButton src="https://img.icons8.com/ios-filled/50/000000/left.png" />
        </Link>
      </ButtonContainer>

      <Map
        pickupCoordinate={pickupCoordinate}
        dropoffCoordinate={dropoffCoordinate}
      />

      <TabWrapper>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab _selected={{ color: "white", bg: "black" }}>Book Cab</Tab>
            <Tab _selected={{ color: "white", bg: "black" }}>
              Get ride on a Shared Cab
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RideContainer>
                <RideSelector
                  pickupCoordinate={pickupCoordinate}
                  dropoffCoordinate={dropoffCoordinate}
                  changed={changed}
                  setChanged={setChanged}
                />
              </RideContainer>
            </TabPanel>
            <TabPanel>
              <RideContainer>
                <SharedSelector
                  pickuplocation={""+pickuplocation}
                  dropofflocation={""+dropofflocation}
                  changed={changed}
                  setChanged={setChanged}
                />
              </RideContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </TabWrapper>
    </Wrapper>
  );
};

const TabWrapper = tw.div`
h-1/2
overflow-y-scroll
`;

const Wrapper = tw.div`
 flex flex-col h-screen
`;

const RideContainer = tw.div`
flex-1  h-1/2 flex flex-col
`;

const ButtonContainer = tw.div`
rounded-full absolute top-4 left-4 z-10 bg-white shadow-md cursor-pointer
`;

const BackButton = tw.img`
h-full object-contain
`;

export default Confirm;
