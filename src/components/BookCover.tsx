import React, { useRef, useState, useCallback } from 'react';
import ImagePreview from './ImagePreview';
import ImageControls from './ImageControls';
import DownloadButton from './DownloadButton';
import TextControl from './TextControls';

const BookCover = () => {
  const coverRef = useRef<HTMLDivElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [texts, setTexts] = useState({
    title: 'VTNE',
    subtitle: 'PREP STUDY GUIDE',
    year: '2025-2026',
    feature1: 'EXTRA 399+ STUDY TOOLS',
    author: 'AIDEN WHITLOCK',
    bottomText: 'VETERINARY TECHNICIAN LICENSE'
  });

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setIsImageLoading(false);
        setImageScale(1);
        setImagePosition({ x: 0, y: 0 });
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const handleConfirmImage = useCallback(() => {
    setBackgroundImage(previewImage);
    setPreviewImage(null);
  }, [previewImage]);

  const handleCancelImage = useCallback(() => {
    setPreviewImage(null);
  }, []);

  const updateText = (key: keyof typeof texts, value: string) => {
    setTexts(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="flex flex-col items-center gap-8 py-8">
        <div 
          ref={coverRef}
          className="w-[1600px] h-[2560px] rounded-lg shadow-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #003366 0%, #001a33 100%)',
            transform: 'scale(0.375)',
            transformOrigin: 'top center'
          }}
        >
          {/* Top Banner */}
          <div className="bg-yellow-400 w-full py-8">
            <div className="text-[180px] font-black text-blue-900 text-center tracking-tight">
              {texts.title}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-24 flex flex-col h-[calc(100%-96px)]">
            {backgroundImage && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <img 
                  src={backgroundImage}
                  alt="Background"
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                    opacity: imageOpacity,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            )}

            {/* Subtitle */}
            <div className="text-center space-y-12 relative z-10 mt-24">
              <h2 className="text-[120px] font-bold text-yellow-400 tracking-wide">
                {texts.subtitle}
              </h2>
              <h3 className="text-[100px] font-bold text-white">
                {texts.year}
              </h3>
            </div>

            {/* Feature Box */}
            <div className="mt-auto mb-24 relative z-10">
              <div className="bg-yellow-400 p-12 rounded-2xl transform hover:scale-[1.02] transition-transform">
                <span className="text-blue-900 text-7xl font-bold block text-center">
                  {texts.feature1}
                </span>
              </div>
            </div>

            {/* Author & License Text */}
            <div className="mt-auto space-y-12 relative z-10">
              <div className="text-white text-6xl font-bold text-center">
                {texts.author}
              </div>
              <div className="text-yellow-400 text-5xl font-bold text-center tracking-wide">
                {texts.bottomText}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-[600px] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Cover Image
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageUpload}
              disabled={isImageLoading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50"
            />
          </div>

          {backgroundImage && (
            <ImageControls
              opacity={imageOpacity}
              position={imagePosition}
              scale={imageScale}
              onOpacityChange={setImageOpacity}
              onPositionChange={(axis, value) => setImagePosition(prev => ({ ...prev, [axis]: value }))}
              onScaleChange={setImageScale}
            />
          )}

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-lg font-semibold mb-4">Text Controls</h3>
            <div className="grid grid-cols-1 gap-4">
              <TextControl
                label="Title"
                value={texts.title}
                onChange={(value) => updateText('title', value)}
              />
              <TextControl
                label="Subtitle"
                value={texts.subtitle}
                onChange={(value) => updateText('subtitle', value)}
              />
              <TextControl
                label="Year"
                value={texts.year}
                onChange={(value) => updateText('year', value)}
              />
              <TextControl
                label="Feature Text"
                value={texts.feature1}
                onChange={(value) => updateText('feature1', value)}
              />
              <TextControl
                label="Author"
                value={texts.author}
                onChange={(value) => updateText('author', value)}
              />
              <TextControl
                label="Bottom Text"
                value={texts.bottomText}
                onChange={(value) => updateText('bottomText', value)}
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <DownloadButton coverRef={coverRef} />
          </div>
        </div>
      </div>

      <ImagePreview
        imageUrl={previewImage}
        onConfirm={handleConfirmImage}
        onCancel={handleCancelImage}
        isLoading={isImageLoading}
      />
    </>
  );
};

export default BookCover;