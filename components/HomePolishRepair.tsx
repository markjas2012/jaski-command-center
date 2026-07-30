"use client";

import { useEffect } from "react";

export default function HomePolishRepair() {
  useEffect(() => {
    let applying = false;

    const leafElements = () =>
      Array.from(document.querySelectorAll<HTMLElement>("body *")).filter(
        (el) => el.children.length === 0
      );

    const exactText = (text: string) =>
      leafElements().find((el) => el.textContent?.trim() === text);

    const removeCardByLabel = (label: string) => {
      const labelEl = exactText(label);
      if (!labelEl) return;

      const anchor = labelEl.closest("a");
      if (anchor) {
        anchor.remove();
        return;
      }

      // Fallback for non-anchor cards.
      let node: HTMLElement | null = labelEl.parentElement;
      while (node && node !== document.body) {
        const rect = node.getBoundingClientRect();
        if (rect.width > 180 && rect.height > 45 && rect.height < 180) {
          node.remove();
          return;
        }
        node = node.parentElement;
      }
    };

    const removeGratefulDeadDailyCard = () => {
      const marker =
        exactText("TODAY IN GRATEFUL DEAD HISTORY") ||
        leafElements().find((el) =>
          (el.textContent || "").includes("TODAY IN GRATEFUL DEAD HISTORY")
        );

      if (!marker) return;

      let node: HTMLElement | null = marker.parentElement;
      while (node && node !== document.body) {
        const text = node.textContent || "";
        const rect = node.getBoundingClientRect();

        if (
          text.includes("TODAY IN GRATEFUL DEAD HISTORY") &&
          text.includes("The Grateful Dead Archive") &&
          rect.width > 250 &&
          rect.height > 180
        ) {
          node.remove();
          return;
        }
        node = node.parentElement;
      }
    };

    const repairWeather = () => {
      const weatherLabel = exactText("LIVE WEATHER");
      if (!weatherLabel) return;

      let weatherCard: HTMLElement | null = weatherLabel.parentElement;
      while (
        weatherCard &&
        weatherCard !== document.body &&
        !(
          (weatherCard.textContent || "").includes("HIGH") &&
          (weatherCard.textContent || "").includes("LOW") &&
          (weatherCard.textContent || "").includes("FEELS LIKE")
        )
      ) {
        weatherCard = weatherCard.parentElement;
      }

      if (!weatherCard || weatherCard === document.body) return;

      const cardRect = weatherCard.getBoundingClientRect();

      const squareCandidates = Array.from(
        weatherCard.querySelectorAll<HTMLElement>("div, span")
      )
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => {
          return (
            rect.width >= 70 &&
            rect.width <= 130 &&
            rect.height >= 70 &&
            rect.height <= 130 &&
            Math.abs(rect.width - rect.height) < 16 &&
            rect.left > cardRect.left + cardRect.width * 0.55 &&
            rect.top < cardRect.top + cardRect.height * 0.42
          );
        })
        .sort((a, b) => b.rect.left - a.rect.left);

      const iconBox = squareCandidates[0]?.el;
      if (!iconBox) return;

      if ((iconBox.textContent || "").trim() !== "\u2600") {
        iconBox.replaceChildren();

        const sun = document.createElement("span");
        sun.textContent = "\u2600";
        sun.setAttribute("aria-hidden", "true");
        sun.style.fontSize = "42px";
        sun.style.lineHeight = "1";
        sun.style.color = "white";
        sun.style.display = "grid";
        sun.style.placeItems = "center";
        sun.style.width = "100%";
        sun.style.height = "100%";
        sun.style.pointerEvents = "none";

        iconBox.appendChild(sun);
        iconBox.setAttribute("aria-label", "Clear skies");
      }
    };

    const cleanGratefulDeadText = () => {
      for (const action of [
        "Explore recordings",
        "Compare eras",
        "Choose today's listen",
      ]) {
        const matches = leafElements().filter((el) =>
          (el.textContent || "").includes(action)
        );

        for (const el of matches) {
          el.textContent = "\u2022 " + action;
        }
      }
    };

    const applyRepairs = () => {
      if (applying) return;
      applying = true;

      try {
        // Favorites cleanup.
        removeCardByLabel("DarkUFO");
        removeCardByLabel("Masters");
        removeCardByLabel("Radar");

        // Daily ritual cleanup.
        removeGratefulDeadDailyCard();

        // Existing repairs retained.
        cleanGratefulDeadText();
        repairWeather();
      } finally {
        applying = false;
      }
    };

    applyRepairs();

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;

      requestAnimationFrame(() => {
        scheduled = false;
        applyRepairs();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
