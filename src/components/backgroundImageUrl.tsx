import { useEffect, useState } from 'react';

function BackgroundImageLoader({ imageUrl, setIsLoaded }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setIsLoaded(true);
    };

    // Optional: handle errors during image loading
    img.onerror = (error) => {
      console.error(`Error loading background image: ${error}`);
    };
  }, [imageUrl]);

  return isLoaded ? <div className="background-image" style={{ backgroundImage: `url(${imageUrl})` }} /> : null;
}

export default BackgroundImageLoader;

