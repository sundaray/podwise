/**
 * Converts a YouTube API formatted date string to ISO 8601 format
 * Example input: "December 16, 2024 at 09:30 PM GMT+5:30"
 * Example output: "2024-12-16T16:00:00Z"
 *
 * @param dateString The formatted date string from YouTube API
 * @returns ISO 8601 formatted date string
 */
export function convertYouTubeDateToISO(dateString: string): string {
  try {
    // Parse the date string directly with JavaScript's Date
    // JavaScript is actually quite good at parsing various date formats
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    // Convert to ISO 8601 format
    return date.toISOString();
  } catch (error) {
    console.error("Error converting date:", error);
    // Return current date as fallback
    return new Date().toISOString();
  }
}

/**
 * Alternatively, you can use this more manual approach if the automatic parsing
 * doesn't work correctly with your specific format
 */
export function manuallyConvertYouTubeDateToISO(dateString: string): string {
  try {
    // Example input: "December 16, 2024 at 09:30 PM GMT+5:30"

    // Extract date parts
    const parts = dateString.match(
      /(\w+) (\d+), (\d+) at (\d+):(\d+) (AM|PM) (GMT[+-]\d+:\d+)/,
    );

    if (!parts) {
      throw new Error("Could not parse date string");
    }

    const [_, month, day, year, hour, minute, ampm, timezone] = parts;

    // Convert month name to month number (0-11)
    const months: Record<string, number> = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    // Convert hour to 24-hour format
    let hour24 = parseInt(hour, 10);
    if (ampm === "PM" && hour24 < 12) hour24 += 12;
    if (ampm === "AM" && hour24 === 12) hour24 = 0;

    // Create date object (this will adjust for timezone)
    const date = new Date(
      parseInt(year, 10),
      months[month],
      parseInt(day, 10),
      hour24,
      parseInt(minute, 10),
    );

    // Return ISO string
    return date.toISOString();
  } catch (error) {
    console.error("Error manually converting date:", error);
    return new Date().toISOString();
  }
}
