import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store";
import { login } from "../../features/slices/authSlice";
import { LoginRequest } from "../../features/slices/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginFormData, setLoginFormData] = useState<LoginRequest>({
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
      const result = await dispatch(login(loginFormData)).unwrap();
      if (result) {
        switch (result.role) {
          case 'shopper':
            navigate("/", { replace: true });
            break;
          case 'seller':
            navigate("/seller", { replace: true });
            break;
          case 'admin':
            navigate("/admin", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      }
    } catch (err: any) {
      if (err.status === 404) {
        toast.error("User not found. Please check your email.");
      } else if (err.status === 401) {
        toast.error("Invalid credentials. Please check your password.");
      } else {
        toast.error("Server error! Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-400 p-5">
      <div className="bg-white w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/4 p-8 rounded-3xl shadow-2xl drop-shadow-2xl shadow-black border-2 border-black">
        <div className="text-center mb-6 font-extrabold">LOGIN</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-gray-600 mt-12">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:border-blue-500"
              value={loginFormData.email}
              placeholder="example@email.com"
              onChange={(e) =>
                setLoginFormData({ ...loginFormData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="relative">
            <label className="block text-gray-600">
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Password
            </label>
            <div className="flex">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="w-full p-2 pl-10 border rounded-l-md focus:outline-none focus:border-blue-500"
                value={loginFormData.password}
                placeholder="********"
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, password: e.target.value })
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
              "Login"
            )}
          </button>

          <div className="text-center flex justify-center gap-3">
            <button
              type="button"
              className="text-gray-500 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="text-gray-500 hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
