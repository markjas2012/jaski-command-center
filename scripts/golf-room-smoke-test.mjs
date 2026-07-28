const base = process.env.GOLF_BASE_URL || "http://localhost:3000";

const checks = [
  ["/api/golf-leaderboard", (d) => Array.isArray(d?.leaders), "leaderboard"],
  ["/api/fedex-cup", (d) => Array.isArray(d?.standings), "FedEx Cup"],
  ["/api/golf-next-event", (d) => typeof d?.available === "boolean", "next event"],
  ["/api/golf-news", (d) => Array.isArray(d?.stories), "golf news"],
];

let failed = false;

for (const [path, validate, label] of checks) {
  try {
    const res = await fetch(`${base}${path}`);
    const data = await res.json();
    const ok = res.ok && validate(data);
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}  ${path}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`FAIL  ${label}  ${path}  ${error instanceof Error ? error.message : error}`);
  }
}

if (failed) process.exitCode = 1;
