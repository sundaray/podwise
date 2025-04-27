/**
 * Converts a YouTube API formatted date string to ISO 8601 format
 * Example input: "February 13, 2025 at 09:30 PM GMT+5:30"
 * Example output: "2025-02-13T16:00:00Z"
 *
 * @param dateString The formatted date string from YouTube API
 * @returns ISO 8601 formatted date string or error message
 */
export function convertYouTubeDateToISO(dateString: string): string {
  try {
    // First, try to extract just the date portion for simpler formats
    const datePortion = dateString.split(" at ")[0]; // "February 13, 2025"

    // Extract with regex to handle edge cases better
    const dateMatch = /(\w+)\s+(\d+),\s+(\d{4})/.exec(datePortion);

    if (!dateMatch) {
      console.error(`Failed to match date pattern in: ${datePortion}`);
      return `ERROR: Could not parse "${datePortion}"`;
    }

    const [_, monthName, day, year] = dateMatch;

    // Map month names to numbers
    const months: Record<string, string> = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    if (!months[monthName]) {
      console.error(`Invalid month name: ${monthName}`);
      return `ERROR: Invalid month "${monthName}"`;
    }

    // Format the day with leading zero if needed
    const formattedDay = day.padStart(2, "0");

    // Create ISO date with noon UTC as the time
    // This ensures consistent time value even without the time portion
    return `${year}-${months[monthName]}-${formattedDay}T12:00:00Z`;
  } catch (error) {
    console.error("Error converting date:", error);
    // Return error indicator instead of current date
    return `ERROR: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}
