
export function stripHtmlTags(html: string): string {
if (!html) return "";

// 1. Remove CSS blocks like `p.p1 { ... }`
let cleaned = html.replace(/([a-zA-Z0-9.#]+\s*\{[^}]*\})/g, "");

// 2. Remove actual HTML tags (if any)
cleaned = cleaned.replace(/<[^>]*>/g, "");

// 3. Decode HTML entities and trim whitespace
const div = document.createElement("div");
div.innerHTML = cleaned;
return div.textContent?.trim() || "";
}