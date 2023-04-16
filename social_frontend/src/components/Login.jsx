import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    console.log("response:", response);
    if (!response.profileObj) {
      console.warn("Profile object is missing from Google API response");

      // Try to extract name and email from response object
      const name = response?.tokenIdPayload?.name || "Unknown";
      const email = response?.tokenIdPayload?.email || "Unknown";

      // Store user information in local storage
      localStorage.setItem("user", JSON.stringify({ name, email }));

      // Navigate to home page
      navigate("/", { replace: true });
      return;
    }

    // Store user information in local storage
    localStorage.setItem("user", JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl } = response.profileObj;
    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };
    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              useOneTap={true}
              autoSelect={true}
              render={(renderProps) => (
                <button
                  type="button"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                >
                  <FcGoogle className="mr-4" />
                  Sign in with Google
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
