"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return null;
  }

  const day = now.toLocaleDateString([], {
    weekday: "long",
  });

  const date = now.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="jaski-muted">
      <div className="text-sm font-semibold">{day}</div>
      <div className="text-sm">{date}</div>
      <div className="mt-1 text-sm">{time}</div>
    </div>
  );
}