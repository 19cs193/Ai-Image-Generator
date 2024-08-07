import React, { useState, useRef } from 'react';
import './ImageGenerator.css'; // Ensure this path is correct
import default_image from '../Assets/default_image.svg';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('/');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    if (inputRef.current.value === '') {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer "Your Api Key',//Put your Api key here 
          'User-Agent': 'Chrome',
        },
        body: JSON.stringify({
          prompt: `${inputRef.current.value}`,
          n: 1,
          size: '512x512',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        setImageUrl(data.data[0].url);
      } else {
        throw new Error('No image URL found in the response');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ai-image-generator'>
      <div className='header'>
        Ai-image <span>Generator</span>
      </div>
      <div className='img-loading'>
        <div className='image'>
          <img src={imageUrl === '/' ? default_image : imageUrl} alt='' />
          <div className='loading'>
            <div className={loading ? 'loading-bar-full' : 'loading-bar'}></div>
            <div className={loading ? 'loading-text' : 'display-none'}>Loading...</div>
          </div>
        </div>
        <div className='search-box'>
          <input
            type='text'
            ref={inputRef}
            className='search-input'
            placeholder='Describe what you want to see'
          />
          <div className='generate-btn' onClick={imageGenerator}>
            Generate
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
