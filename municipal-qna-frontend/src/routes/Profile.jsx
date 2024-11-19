import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await apiRequest('/users/me', 'GET', null, token);
          setUser(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
