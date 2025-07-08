

export function calculateDuration(joiningDateTimestamp) {
  const now = Date.now(); // Current time in milliseconds
  const durationMillis = now - joiningDateTimestamp;

  const days = Math.floor(durationMillis / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durationMillis / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((durationMillis / (1000 * 60)) % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes`;
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return `${day}${getOrdinal(day)} ${month} ${year}`;
}

export function getOrdinal(day) {
  if (day > 3 && day < 21) return "th"; // 11th to 20th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function hasExceeded31Days(joiningDateTimestamp) {
  const now = Date.now();
  const durationMillis = now - joiningDateTimestamp;
  const days = durationMillis / (1000 * 60 * 60 * 24);
  return days > 31;
}

export async function notifyUser(client, message) {
  try {
    let userIds = ["6261487516", "423100738"];
    userIds.forEach(async (userId) => {
      await client.sendMessage(userId, { message });
    });
    console.log(`📤 Notification sent: ${message}`);
  } catch (error) {
    console.error(`⚠️ Failed to send notification:`, error);
  }
}
