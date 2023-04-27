import tw from "tailwind-styled-components";
import Map from "./components/Map";
import Link from "next/link";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photoUrl: user.photoURL,
        });
      } else {
        setUser(null);
        router.push("/login");
      }
    });
  }, []);

  return (
    <Wrapper>
      <Map />
      <ActionItems>
        <Header>
          <Logo>BookCab</Logo>
          <Profile>
            <Name>{user && user.name.toLowerCase()}</Name>
            <UserImage
              src={user && user.photoUrl}
              onClick={() => signOut(auth)}
            />
          </Profile>
        </Header>

        <CenteredActionButtons>
          <ActionButtons>
            <Link href="/search" passHref>
              <ActionButton>
                <ActionButtonImage src="https://i.ibb.co/cyvcpfF/uberx.png" />
                get a ride
              </ActionButton>
            </Link>
          </ActionButtons>
        </CenteredActionButtons>
      </ActionItems>
    </Wrapper>
  );
}

const Logo = tw.div`
  flex items-center justify-center sm:text-4xl md:text-5xl font-bold text-black uppercase
`;

const CenteredActionButtons = tw.div`
  flex justify-center m-20
`;

const Wrapper = tw.div`
  flex flex-col h-screen
`;

const ActionItems = tw.div`
  flex-1 p-4 bg-blue-300 border-solid border-2 border-sky-500
`;

const Header = tw.div`
  flex justify-between items-center
`;

const Profile = tw.div`
  flex items-center
`;


const ActionButtons = tw.div`
  flex
`;

const ActionButton = tw.div`
  flex flex-col bg-purple-200 italic text-black  flex-1 m-1 h-32 w-80 items-center justify-center rounded-lg transform hover:scale-105 transition text-xl cursor-pointer shadow-md
`;

const ActionButtonImage = tw.img`
  h-3/5 p-0 m-0
`;

const InputButton = tw.div`
  h-20 bg-gray-200 text-2xl p-4 flex items-center justify-center rounded-lg transform hover:scale-105 transition mt-8 shadow-md
`;

const Name = tw.div`
  mr-2 text-sm font-semibold underline font-100
`;

const UserImage = tw.img`
  h-12 w-12 rounded-full border border-gray-200 p-px cursor-pointer
`;
