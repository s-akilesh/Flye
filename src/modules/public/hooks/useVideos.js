import { useState } from 'react';
import videosData from '../../../shared/config/videos.json';

/**
 * Hook to retrieve and manage video learning resources.
 */
export const useVideos = () => {
  const [videos] = useState(() =>
    videosData.filter((item) => item.status === 'active' || item.status === 'coming-soon')
  );

  const getFeaturedVideos = () => {
    return videos.filter((item) => item.featured);
  };

  const getVideosByCategory = (category) => {
    return videos.filter((item) => item.category === category);
  };

  return {
    videos,
    getFeaturedVideos,
    getVideosByCategory
  };
};
