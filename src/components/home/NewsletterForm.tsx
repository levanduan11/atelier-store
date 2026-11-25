"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) return <p className="text-eyebrow">Thank you. You&apos;re on the list.</p>;

  return (
    <form
      className="flex flex-col gap-6 md:flex-row md:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="flex-1">
        <span className="text-eyebrow">Email address</span>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          className="field mt-1"
        />
      </label>
      <button type="submit" className="btn btn-primary btn-block">
        Subscribe
      </button>
    </form>
  );
}
