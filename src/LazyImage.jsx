import React, { useState } from 'react';

const LazyImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`lazy-image-wrapper ${loaded ? 'loaded' : 'loading'}`}>
      <img 
        src={src} 
        alt={alt} 
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0.5, transition: 'opacity 0.3s ease-in-out' }}
      />
    </div>
  );
};

export default LazyImage;
