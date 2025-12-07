import React from 'react';
import { SOUNDCLOUD_SRC } from '../constants';
import { Headphones } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold">
          <Headphones className="w-5 h-5" />
          <span>Listening Audio Source</span>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 h-[100px]">
          <iframe
            width="100%"
            height="166" // SoundCloud minimal player height
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={SOUNDCLOUD_SRC}
            className="-mt-[20px]" // Slight negative margin to hide top branding if desired, or keep as is.
            title="SoundCloud Player"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;