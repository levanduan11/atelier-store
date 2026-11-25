"use client";

import { useState } from "react";

// Placeholder until the cart exists: only tracks local "added" feedback.
export function AddToBag({ soldOut }: { soldOut: boolean }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className="btn btn-primary btn-block w-full"
        disabled={soldOut}
        onClick={() => setAdded(true)}
      >
        {soldOut ? "Sold out" : added ? "Added to bag" : "Add to bag"}
      </button>
      {soldOut ? (
        <button type="button" className="btn btn-secondary btn-block w-full">
          Notify me when available
        </button>
      ) : (
        <p className="text-fine" role="status">
          {added ? "Added to your bag." : "Complimentary shipping on orders over $250."}
        </p>
      )}
    </div>
  );
}
