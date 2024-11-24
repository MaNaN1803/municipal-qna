import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest("/auth/me");
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>
      {user ? (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Questions Posted:</strong> {user.questionsPosted || 0}
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading your profile...</p>
      )}
    </div>
  );
};

export default Profile;
