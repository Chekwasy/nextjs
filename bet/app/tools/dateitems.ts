export const isDateInPast = (dateString: string) => {
  const dateParts = dateString.match(/(\d{2})(\d{2})(\d{4})/);
  if (!dateParts) return false;

  const day = parseInt(dateParts[1]);
  const month = parseInt(dateParts[2]) - 1; // Months are 0-based
  const year = parseInt(dateParts[3]);

  const inputDate = new Date(year, month, day);
  const currentDate = new Date();

  return inputDate.getTime() < currentDate.getTime();
};

export const getDateTimeString = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  return `${day}${month}${year}`;
};

export const getSeventhDay = (dateString: string) => {
  const dateParts = dateString.match(/(\d{2})(\d{2})(\d{2})/);
  if (!dateParts) return null;

  const day = parseInt(dateParts[1]);
  const month = parseInt(dateParts[2]);
  const year = parseInt(dateParts[3]);

  const date = new Date(parseInt(`20${year}`), month - 1, day + 7);

  const seventhDay = date.getDate().toString().padStart(2, '0');
  const seventhMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const seventhYear = date.getFullYear().toString().slice(-2);

  return `${seventhDay}${seventhMonth}${seventhYear}`;
};

export const getThirtiethDay = (dateString: string): string | null => {
  const dateParts = dateString.match(/(\d{2})(\d{2})(\d{2})/);
  if (!dateParts) {
    // Handle invalid date string format
    console.error("Invalid date string format. Expected DDMMYY.");
    return null;
  }

  const day = parseInt(dateParts[1], 10);
  const month = parseInt(dateParts[2], 10);
  const year = parseInt(dateParts[3], 10);

  // Construct the full year. Assuming 'YY' refers to 20YY.
  // This might need adjustment if your 'YY' can refer to 19YY (e.g., if parsing dates from before 2000).
  const fullYear = parseInt(`20${year}`, 10);

  // Create a Date object. Month is 0-indexed in JavaScript (0 for Jan, 11 for Dec).
  const startDate = new Date(fullYear, month - 1, day);

  // Add 30 days to the date
  // JavaScript's Date object automatically handles month and year rollovers
  startDate.setDate(startDate.getDate() + 30);

  // Format the new date back to DDMMYY
  const newDay = startDate.getDate().toString().padStart(2, '0');
  const newMonth = (startDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
  const newYear = startDate.getFullYear().toString();

  return `${newDay}${newMonth}${newYear}`;
};