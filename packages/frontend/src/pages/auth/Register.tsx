import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "../../store";
import { register } from "../../features/slices/authSlice";
import { RegisterRequest } from "../../features/slices/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registerFormData, setRegisterFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const status = useAppSelector((state) => state.auth.status);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(register(registerFormData)).unwrap();
      if (result) {
        setRegisterFormData({ username: "", email: "", password: "" });
        toast.success("Registration successful", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: any) {
      // Tangani error dari Redux state
      if (err.status === 400) {
        toast.error(err.message);
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-400 p-5">
      <div className="bg-white w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/4 p-8 rounded-3xl shadow-2xl drop-shadow-2xl shadow-black border-2 border-black">
        <div className="text-center mb-6 font-extrabold">Register</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-gray-600 mt-4">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Username
            </label>
            <input
              type="text"
              className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:border-blue-500"
              value={registerFormData.username}
              placeholder="Enter your username"
              onChange={(e) =>
                setRegisterFormData({
                  ...registerFormData,
                  username: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="relative">
            <label className="block text-gray-600 mt-4">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:border-blue-500"
              value={registerFormData.email}
              placeholder="example@email.com"
              onChange={(e) =>
                setRegisterFormData({
                  ...registerFormData,
                  email: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="relative">
            <label className="block text-gray-600 mt-4">
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Password
            </label>
            <div className="flex">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="w-full p-2 pl-10 border rounded-l-md focus:outline-none focus:border-blue-500"
                value={registerFormData.password}
                placeholder="Your password"
                onChange={(e) =>
                  setRegisterFormData({
                    ...registerFormData,
                    password: e.target.value,
                  })
                }
                required
              />
              <button
                type="button"
                className="p-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 ${
              status === "loading" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <ClipLoader color="white" loading={status === "loading"} size={25} />
            ) : (
              "Register"
            )}
          </button>
          <div
            className="flex justify-center hover:underline p-2 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to login
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
