// // src/components/Profile/Profile.js
// import React from 'react';
// import useAuth from '../../hooks/useAuth';

// const Profile = () => {
//   const { user } = useAuth();

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Welcome, {user.name}</h1>
//       <p>Email: {user.email}</p>
//     </div>
//   );
// };

// export default Profile;

// src/components/Profile/Profile.js
// import React from 'react';
// import useAuth from '../../hooks/useAuth';

// const Profile = () => {
//   const { user } = useAuth();

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="container mt-5">
//       <h2>Dashboard</h2>
//       <div>
//         <h3>Welcome, {user.name}</h3>
//         <p>Email: {user.email}</p>
//       </div>
//     </div>
//   );
// };

// export default Profile;

// import React, { Profiler, useEffect, useState } from 'react';
// import { getUser, logout } from '../../api/auth';
// import { useNavigate } from 'react-router-dom';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await getUser();
//         setUser(userData.user);
//       } catch (error) {
//         console.error('Failed to fetch user', error);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout failed', error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Dashboard</h2>
//       {user ? (
//         <div>
//           <p>Welcome, {user.name}</p>
//           <button onClick={handleLogout} className="btn btn-danger">Logout</button>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;

// src/components/Profile/Profile.js
// import React, { useState, useEffect } from 'react';
// import { getUser } from '../../api/auth';

// const Profile = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await getUser();
//         setUser(response.data.user);
//       } catch (error) {
//         console.error('Failed to fetch user data:', error);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <div>
//       <h2>Profile</h2>
//       {user ? (
//         <div>
//           <h3>Welcome, {user.name}</h3>
//           <p>Email: {user.email}</p>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;

// ---------------------------------------------------------

// src/components/Profile/Profile.js
// import React, { useState, useEffect } from 'react';
// import { getUser } from '../../api/auth';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await getUser();
//         setUser(response.user);
//       } catch (error) {
//         setError(error.message);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <div>
//       <h2>Profile</h2>
//       {error ? (
//         <p>Error: {error}</p>
//       ) : user ? (
//         <div>
//           <h3>Welcome, {user.name}</h3>
//           <p>Email: {user.email}</p>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;


// -------------------------------------------

// src/components/Profile/Profile.js
// import React, { useState, useEffect } from 'react';
// import { getUser } from '../../api/auth';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await getUser();
//         setUser(response.user);
//         // console.log("token : "+localStorage.getItem('token'));
//       } catch (error) {
//         setError('Failed to fetch user data: ' + error.message);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <div>
//       <h2>Profile</h2>
//       {error ? (
//         <p>Error: {error}</p>
//       ) : user ? (
//         <div>
//           <h3>Welcome, {user.name}</h3>
//           <p>Email: {user.email}</p>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from 'react';
import { getUser, logout } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.user);
      } catch (error) {
        setError('Failed to fetch user data: ' + error.message);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token'); // Remove token from local storage
      navigate('/'); // Redirect to login page
    } catch (error) {
      setError('Failed to logout: ' + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : user ? (
        <div>
          <h3>Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
