import React, { useState } from 'react';
import { FileImageOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const SafeImage = ({ 
  src, 
  thumbnailUrl, 
  alt, 
  className, 
  onClick, 
  fallbackClassName = "flex items-center justify-center bg-gray-100 text-gray-400"
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(thumbnailUrl || src);
  const [retryCount, setRetryCount] = useState(0);

  const handleImageError = () => {
    console.error('Image failed to load:', {
      currentSrc,
      thumbnailUrl,
      src,
      alt,
      retryCount
    });

    // Try fallback to original URL if we were using thumbnail
    if (currentSrc === thumbnailUrl && src && src !== thumbnailUrl && retryCount === 0) {
      console.log('Falling back to original URL');
      setCurrentSrc(src);
      setRetryCount(1);
      return;
    }

    // If all attempts failed, show error state
    setImageError(true);
  };

  const handleRetry = () => {
    setImageError(false);
    setRetryCount(0);
    setCurrentSrc(thumbnailUrl || src);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', alt);
    setImageError(false);
  };

  if (imageError) {
    return (
      <div className={`${fallbackClassName} ${className}`} onClick={onClick}>
        <div className="text-center p-4">
          <FileImageOutlined className="text-2xl mb-2" />
          <p className="text-xs mb-2">Failed to load image</p>
          <p className="text-xs text-gray-500 mb-2 truncate max-w-32">{alt}</p>
          <Button 
            size="small" 
            icon={<ReloadOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
            type="text"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!currentSrc) {
    return (
      <div className={`${fallbackClassName} ${className}`} onClick={onClick}>
        <div className="text-center p-4">
          <FileImageOutlined className="text-2xl mb-2" />
          <p className="text-xs text-gray-500 truncate max-w-32">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};

export default SafeImage; 