import React from "react";
import RippleWaveLoader from "./mvpblocks/ripple-loader";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <RippleWaveLoader />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

// Full page loading component
export function FullPageLoading({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <RippleWaveLoader />
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  );
}

// Compact loading for buttons and small areas
export function CompactLoading() {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="flex space-x-1">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: "1s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
