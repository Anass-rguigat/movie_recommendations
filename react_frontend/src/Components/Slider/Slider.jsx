import  { useState, useEffect } from 'react';
import './Slider.css'; // Import the CSS file

const Slider = () => {
  const [itemActive, setItemActive] = useState(0);

  // List of slider items
  const items = [
    {
      "imageUrl": "https://i.postimg.cc/rFnb8n1b/img1.png",
      "title": "Title 1",
      "description": "Description 1",
      "genre": "DRAMA - CRIME"
    },
    {
      "imageUrl": "https://i.postimg.cc/tgLbkw0x/img2.jpg",
      "title": "Title 2",
      "description": "Description 2",
      "genre": "DRAMA - CRIME"
    },
    {
      "imageUrl": "https://i.postimg.cc/5278kq2J/img3.jpg",
      "title": "Title 3",
      "description": "Description 3",
      "genre": "DRAMA - CRIME"
    },
    {
      "imageUrl": "https://i.postimg.cc/mkpbGDzP/img4.jpg",
      "title": "Title 4",
      "description": "Description 4",
      "genre": "Genre 4"
    },
    {
      "imageUrl": "https://i.postimg.cc/mDxz0dxv/img5.jpg",
      "title": "Title 5",
      "description": "Description 5",
      "genre": "Genre 5"
    },
    {
      "imageUrl": "https://i.postimg.cc/rFnb8n1b/img1.png",
      "title": "Title 6",
      "description": "Description 6",
      "genre": "Genre 6"
    },
    {
      "imageUrl": "https://i.postimg.cc/tgLbkw0x/img2.jpg",
      "title": "Title 7",
      "description": "Description 7",
      "genre": "Genre 7"
    },
    {
      "imageUrl": "https://i.postimg.cc/5278kq2J/img3.jpg",
      "title": "Title 8",
      "description": "Description 8",
      "genre": "Genre 8"
    },
    {
      "imageUrl": "https://i.postimg.cc/mkpbGDzP/img4.jpg",
      "title": "Title 9",
      "description": "Description 9",
      "genre": "Genre 9"
    },
    {
      "imageUrl": "https://i.postimg.cc/rFnb8n1b/img1.png",
      "title": "Title 10",
      "description": "Description 10",
      "genre": "Genre 10"
    }
  ]
  
  const nextSlide = () => {
    setItemActive((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setItemActive((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleThumbnailClick = (index) => {
    setItemActive(index);
  };

  return (
    <div className="slider">
      <div className="list">
        {items.map((item, index) => (
          <div key={index} className={index === itemActive ? "item active" : "item"}>
            <img src={item.imageUrl} alt={`Slider ${index + 1}`} />
            <div className="content">
              <p>{item.genre}</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <button className="btn">Button</button>
            </div>
          </div>
        ))}
      </div>
      <div className="arrows">
        <button onClick={prevSlide}>{"<"}</button>
        <button onClick={nextSlide}>{">"}</button>
      </div>
      <div className="thumbnail">
        {items.map((item, index) => (
          <div key={index} className={index === itemActive ? "item active" : "item"} onClick={() => handleThumbnailClick(index)}>
            <img src={item.imageUrl} alt={`Thumbnail ${index + 1}`} />
            <div className="title">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;