export const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and pad with leading zero if needed
    const year = date.getFullYear(); // Get the full year
  
    return `${day}-${month}-${year}`; // Concatenate in the dd-mm-yyyy format
  };
  export const parseDDMMYYYYToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('-').map(Number); // Split the string and convert parts to numbers
    
    // Months in JavaScript are 0-based, so subtract 1 from the month
    return new Date(year, month - 1, day);
  };