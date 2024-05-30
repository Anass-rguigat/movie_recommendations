import './Card.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import pic1 from '../../assets/pic1.jpg';
import pic2 from '../../assets/pic2.jpg';
import pic3 from '../../assets/pic3.jpg';
import pic4 from '../../assets/pic4.jpg';
import pic5 from '../../assets/pic5.jpg';
import pic6 from '../../assets/pic6.jpg';
import pic7 from '../../assets/pic7.jpg';
import pic8 from '../../assets/pic8.jpg';
const Card = () => {
    const renderStars = (rating) => {
        const totalStars = 5;
        let stars = [];
        for (let i = 1; i <= totalStars; i++) {
          if (rating >= i) {
            stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star filled" />);
          } else if (rating >= i - 0.5) {
            stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="star half" />);
          } else {
            stars.push(<FontAwesomeIcon key={i} icon={farStar} className="star empty" />);
          }
        }
        return stars;
      };
  return (
    <div className='Card' >
        <h1>MOVIE RECOMMEND</h1>
        <div className="container">
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic1} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            KIN
                        </h1>
                        <div className="info">
                            <p> {renderStars(3.5)} | 2023-09-12</p>
                        </div>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">SEE MORE</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic2} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            Gangs of London
                        </h1>
                        <h3 className="info">
                            <p> {renderStars(5)} | 2023-09-12</p>
                        </h3>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">SEE MORE</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic3} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            TULSA KING
                        </h1>
                        <h3 className="info">
                            <p> {renderStars(3)} | 2023-09-12</p>
                        </h3>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">SEE MORE</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic4} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            MAYANS MC
                        </h1>
                        <h3 className="info">
                            <p> {renderStars(5)} | 2023-09-12</p>
                        </h3>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">See More</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic5} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            GRISELDA
                        </h1>
                        <h3 className="info">
                            <p> {renderStars(5)} | 2023-09-12</p>
                        </h3>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">See More</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic6} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            3 BODY PROBLEM
                        </h1>
                        <h3 className="info">
                            <p> {renderStars(3)} | 2023-09-12</p>
                        </h3>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">See More</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic7} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            GENTLEMEN
                        </h1>
                        <h3 className="info">
                            <p> {renderStars(4.5)} | 2023-09-12</p>
                        </h3>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">See More</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="movie-cards">
                <div className="card">
                    <div className="image-container">
                        <img src={pic8} alt="" />
                    </div>
                    <div className="content">
                        <h1 className="name">
                            REACHER
                        </h1>
                        <h3 className="info">
                            <p> {renderStars(3)} | 2023-09-12</p>
                        </h3>
                        <p className="short-desc">Tells the story of London being torn apart by the turbulent power struggles of its international gangs and the sudden power vacuum that is created when the head of London is most powerful crim...</p>
                        <div className="icons">
                            <button className="btn">See More</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card
