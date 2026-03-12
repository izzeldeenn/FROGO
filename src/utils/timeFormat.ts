// Format study time for display
export const formatStudyTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}س ${minutes}د ${remainingSeconds}ث`;
  } else if (minutes > 0) {
    return `${minutes}د ${remainingSeconds}ث`;
  } else {
    return `${remainingSeconds}ث`;
  }
};
