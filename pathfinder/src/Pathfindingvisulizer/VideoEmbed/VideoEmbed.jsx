import React from 'react';

const VideoEmbed = ({ algorithm }) => {
  let videoUrl = '';

  switch (algorithm) {
    case 'dijkstra':
      videoUrl = 'https://www.youtube.com/embed/bZkzH5x0SKU';
      break;
    case 'astar':
      videoUrl = 'https://www.youtube.com/embed/PzEWHH2v3TE';
      break;
    case 'bfs':
      videoUrl = 'https://www.youtube.com/embed/oDqjPvD54Ss';
      break;
    case 'dfs':
      videoUrl = 'https://www.youtube.com/embed/7fujbpJ0LB4';
      break;
    case 'greedy':
      videoUrl = 'https://www.youtube.com/embed/ilYwrsP7zzk';
      break;
    default:
      videoUrl = '';
      break;
  }

  return videoUrl ? (
    <div className="video-container">
      <iframe
        title={`Algorithm ${algorithm} video`}
        width="560"
        height="315"
        src={videoUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  ) : null;
};

export default VideoEmbed;
