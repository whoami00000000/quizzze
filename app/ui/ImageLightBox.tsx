// components/ImageLightBox.tsx
import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Image from 'next/image';

type ImageLightboxProps = {
  url?: string;
  alt: string;
};

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ url, alt }) => {
  return (
    <PhotoProvider>
      {url && (
        <PhotoView src={url}>
          <Image
            src={url}
            alt={alt}
            className="cursor-pointer rounded shadow w-full max-w-screen object-contain"
          />
        </PhotoView>
      )}
    </PhotoProvider>
  );
};
