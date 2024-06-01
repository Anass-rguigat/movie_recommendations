import { useState, useEffect} from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Slider from "../../Components/Slider/Slider";
import { getUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import Loading from "../../Components/loadingAnimation/Loading";

const Top = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await getUser();
  //       setUser(response.user);
  //     } catch (error) {
  //       setError('Failed to fetch user data: ' + error.message);
  //       navigate('/login')
  //     }
  //   };

  //   fetchUser();
  // }, []);
  return (
    <>
    {/* {error ? (
      <p>Error: {error}</p>
    ) : user ? ( */}
        <header className="header-top">
            <Navbar />
            <div className="slider-container"> {/* Add a container for the slider */}
              <Slider />
            </div>
        </header>
        {/* ) : (
          <Loading />
        )} */}
    </>
  );
};

export default Top;
