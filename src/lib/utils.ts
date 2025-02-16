export const formatTimeToMinutes = (seconds: number) => {
  const remainingMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    remainingMinutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0")
  );
};
