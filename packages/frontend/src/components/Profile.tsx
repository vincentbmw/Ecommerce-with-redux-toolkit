import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchUserProfile, logout } from "../features/slices/authSlice";
import { UserIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user && status !== "loading") {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => navigate("/login")} // Redirect ke halaman login
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative" ref={profileRef}>
      <div
        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
        onClick={handleProfileClick}
      >
        <UserIcon className="h-6 w-6 text-gray-700" />
        <span>{user.username}</span>
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
