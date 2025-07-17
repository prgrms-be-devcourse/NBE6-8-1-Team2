"use client";

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-2">{message}</p>;
}
