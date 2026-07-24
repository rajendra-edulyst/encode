type DateFormats = "dd/MM/yyyy" | "dd MMM yyyy" | "dd MMMM yyyy" | "MM/dd/yyyy";

export const formatDate = (dateString: string, format?: DateFormats): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    if (!format) {
        return date.toLocaleDateString("en-GB");
    }

    const options: Record<DateFormats, string> = {
        "dd/MM/yyyy": date.toLocaleDateString("en-GB"), // 31/12/2024
        "dd MMM yyyy": date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }), // 31 Dec 2024
        "dd MMMM yyyy": date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }), // 31 December 2024
        "MM/dd/yyyy": date.toLocaleDateString("en-IN"), // 12/31/2024
    };

    return options[format] || "Invalid format";
};



export const formatDuration = ( minutes: number) => {
  if (!minutes || minutes <= 0) return "0 min";

  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) {
    const hours = (minutes / 60).toFixed(1);
    return `${hours} hour${hours >= 2 ? "s" : ""}`;
  }
  if (minutes < 43200) {
    const days = (minutes / 1440).toFixed(1);
    return `${days} day${days >= 2 ? "s" : ""}`;
  }

  const months = (minutes / 43200).toFixed(1);
  return `${months} month${months >= 2 ? "s" : ""}`;
};

