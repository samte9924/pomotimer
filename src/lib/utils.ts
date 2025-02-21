export const formatTimeToMinutes = (seconds: number) => {
  const remainingMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    remainingMinutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0")
  );
};

export const getRandomColor = (border: boolean = false) => {
  const opacity = border ? 1 : 0.5;
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
