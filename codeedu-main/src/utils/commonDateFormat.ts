// utils/dateFormat.ts
export function formatDate(
  input?: string | number | Date,
  format: string = "DD MMM YYYY"
): string {
  if (!input) return "";

  let date: Date;

  if (typeof input === "number") {
    date = new Date(input.toString().length === 10 ? input * 1000 : input);
  } else if (typeof input === "string") {
    const isoString = input.replace(' ', 'T');
    const parsed = Date.parse(isoString);
    if (isNaN(parsed)) {
      throw new Error("Invalid date string");
    }
    date = new Date(parsed);
  } else {
    date = input;
  }

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12; // Convert to 12-hour

  const map: Record<string, string> = {
    DD: String(date.getDate()).padStart(2, "0"),
    D: String(date.getDate()),

    MM: String(date.getMonth() + 1).padStart(2, "0"),
    M: String(date.getMonth() + 1),
    MMM: date.toLocaleString("en-IN", { month: "short" }),
    MMMM: date.toLocaleString("en-IN", { month: "long" }),

    YY: String(date.getFullYear()).slice(-2),
    YYYY: String(date.getFullYear()),

    H: String(hours24),
    HH: String(hours24).padStart(2, "0"),

    h: String(hours12),
    hh: String(hours12).padStart(2, "0"),

    m: String(date.getMinutes()),
    mm: String(date.getMinutes()).padStart(2, "0"),

    s: String(date.getSeconds()),
    ss: String(date.getSeconds()).padStart(2, "0"),

    A: hours24 >= 12 ? "PM" : "AM",
    a: hours24 >= 12 ? "pm" : "am",

    ddd: date.toLocaleString("en-IN", { weekday: "short" }),
    dddd: date.toLocaleString("en-IN", { weekday: "long" }),
  };


  return format.replace(
    /(MMMM|MMM|MM|M|dddd|ddd|DD|D|YYYY|YY|HH|H|hh|h|mm|m|ss|s|A|a)/g,
    (match) => map[match] || match
  );

}