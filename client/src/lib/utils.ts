import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export type DateInput = Date | string | number;

export function formatPolishDate(
  dateInput: DateInput,
  opts: { format?: "numeric" | "long" } = {},
): string {
  const { format = "numeric" } = opts;
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateInput}`);
  }

  if (format === "long") {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function splitTextToParagraphs(
  text: string,
  sentencesPerParagraph = 2,
): string[] {
  const normalized = text.replace(/\r\n?/g, "\n").trim();

  const sentenceRegex = /[^.?!]+(?:[.?!]+|$)/g;
  const rawSentences = normalized.match(sentenceRegex) || [];

  const sentences = rawSentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(" "));
  }
  return paragraphs;
}
