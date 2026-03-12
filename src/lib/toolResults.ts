// Simple in-memory store for tool results (used by Report Generator)
export interface ToolResult {
  tool: string;
  input: string;
  timestamp: number;
  data: Record<string, unknown>;
}

const KEY = "securetools_results";

export function saveResult(result: ToolResult) {
  const existing = getResults();
  existing.push(result);
  // Keep last 20
  if (existing.length > 20) existing.shift();
  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function getResults(): ToolResult[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearResults() {
  localStorage.removeItem(KEY);
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function shareContent(title: string, text: string) {
  if (navigator.share) {
    return navigator.share({ title, text });
  }
  return copyToClipboard(text);
}
