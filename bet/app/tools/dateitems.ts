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
  const dateParts = dateString.match(/(\d{2})(\d{2})(\d{4})/);
  if (!dateParts) return null;

  const day = parseInt(dateParts[1]);
  const month = parseInt(dateParts[2]);
  const year = parseInt(dateParts[3]);

  const date = new Date(parseInt(`${year}`), month - 1, day + 7);

  const seventhDay = date.getDate().toString().padStart(2, '0');
  const seventhMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const seventhYear = date.getFullYear().toString()

  return `${seventhDay}${seventhMonth}${seventhYear}`;
};

export const getThirtiethDay = (dateString: string) => {
  const dateParts = dateString.match(/(\d{2})(\d{2})(\d{4})/);
  if (!dateParts) return null;

  const day = parseInt(dateParts[1]);
  const month = parseInt(dateParts[2]);
  const year = parseInt(dateParts[3]);

  const date = new Date(parseInt(`${year}`), month - 1, day + 30);

  const thDay = date.getDate().toString().padStart(2, '0');
  const thMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const thYear = date.getFullYear().toString()

  return `${thDay}${thMonth}${thYear}`;
};