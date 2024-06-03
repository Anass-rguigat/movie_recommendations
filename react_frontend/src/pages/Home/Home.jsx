import { useState, useEffect} from "react";
import Background from "../../Components/Background/Background";
import Navbar from "../../Components/Navbar/Navbar";
import Hero from "../../Components/Hero/Hero";
import Card from "../../Components/Cards/Card";
import Footer from "../../Components/Footer/Footer";
//import { getUser } from '../../api/auth';
import { getHybridRecommendations } from '../../api/hybrid';

const Home = () => {
  const [heroData, setHeroData] = useState([]);
    const userId = 4;
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await getHybridRecommendations();
                setHeroData(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();

    }, [userId]);
 //const [user, setUser] = useState(null);
  //const [error, setError] = useState(null);
  //const navigate = useNavigate();
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
  //useEffect(() => {
  //  const interval = setInterval(() => {
  //    setHeroCount((count) => (count + 1) % 3 );
  //  }, 6000);

  //  return () => clearInterval(interval);
  //}, []);



  return (
    <div>
    {/* {error ? (
      <p>Error: {error}</p>
    ) : user ? ( */}
    <div className="home">
      <header className="header-home" >
        <Background heroData={heroData[0]} playStatus={playStatus} heroCount={heroCount} />
        <Navbar />
        
        <Hero
          playStatus={playStatus}
          setPlayStatus={setPlayStatus}
          heroData={heroData[0]}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
        />
      </header>
        <Card heroData={heroData.slice(1)}/>
        <Footer />
    </div>
    {/* // ) : (
    //   <Loading />
    // )} */}
    </div>
  );
};

export default Home;
