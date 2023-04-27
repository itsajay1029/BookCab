import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);

  return (
    <Wrapper>
      <LoginImage src="https://i.ibb.co/CsV9RYZ/login-image.png" />
      <Title>Log in to access your account</Title>
      <SignInButton onClick={() => signInWithPopup(auth, provider)}>
        Sign in with Google
      </SignInButton>
    </Wrapper>
  );
};

const Wrapper = tw.div`
flex flex-col h-screen w-screen bg-blue-300 p-4 items-center justify-center
`;

const SignInButton = tw.button`
bg-black text-white text-center p-4 mt-2 self-center rounded 
`;



const Title = tw.div`
text-xl pt-2 text-gray-500
`;
const LoginImage = tw.img`
object-contain w-80
`;

export default Login;
