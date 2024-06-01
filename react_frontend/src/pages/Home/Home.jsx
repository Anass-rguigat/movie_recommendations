import { useState, useEffect} from "react";
import Background from "../../Components/Background/Background";
import Navbar from "../../Components/Navbar/Navbar";
import Hero from "../../Components/Hero/Hero";
import Card from "../../Components/Cards/Card";
import Footer from "../../Components/Footer/Footer";
import { getUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import Loading from "../../Components/loadingAnimation/Loading";


const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const heroData = [
    { title: "The Winter King ", description: "A former warrior, now turned monk, tells the story of how Arthur became the lord of war despite the illegitimacy of his throne.", genre: "CRIME - FANTASY - DRAMA -HISTORY", rating: 4 },
  ];
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);
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
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count + 1) % heroData.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [heroData.length]);



  return (
    <div>
    {/* {error ? (
      <p>Error: {error}</p>
    ) : user ? ( */}
    <div>
      <header className="header-home" >
        <Background playStatus={playStatus} heroCount={heroCount} />
        <Navbar />
        
        <Hero
          playStatus={playStatus}
          setPlayStatus={setPlayStatus}
          heroData={heroData[0]}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
        />
      </header>
        <Card />
        <Footer />
    </div>
    {/* // ) : (
    //   <Loading />
    // )} */}
    </div>
  );
};

export default Home;
