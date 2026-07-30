import { NextResponse } from "next/server";

type ServiceStatus = "online" | "offline" | "configured";

type RemoteService = {
  id: string;
  label: string;
  status: ServiceStatus;
  detail: string;
};

type HttpServiceDefinition = {
  id: string;
  label: string;
  url: string | undefined;
};

const HTTP_SERVICES: HttpServiceDefinition[] = [
  {
    id: "plex",
    label: "Plex",
    url: process.env.JASKI_PLEX_URL,
  },
  {
    id: "game-server",
    label: "Game Server",
    url: process.env.JASKI_GAME_SERVER_URL,
  },
];

async function checkHttpService(
  definition: HttpServiceDefinition
): Promise<RemoteService | null> {
  if (!definition.url) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(definition.url, {
        method: "GET",
        cache: "no-store",
        redirect: "manual",
        signal: controller.signal,
      });

      return {
        id: definition.id,
        label: definition.label,
        status: response.status < 500 ? "online" : "offline",
        detail:
          response.status < 500
            ? "Reachable from the Jaski server."
            : `Responded with HTTP ${response.status}.`,
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return {
      id: definition.id,
      label: definition.label,
      status: "offline",
      detail: "Configured, but not reachable from the Jaski server.",
    };
  }
}

export async function GET() {
  const checked = await Promise.all(HTTP_SERVICES.map(checkHttpService));
  const services = checked.filter((service): service is RemoteService => service !== null);

  // Apple TV is intentionally not claimed as online until a real control transport
  // is connected. A configured host may be surfaced without inventing availability.
  if (process.env.JASKI_APPLE_TV_HOST) {
    services.push({
      id: "apple-tv",
      label: "Apple TV",
      status: "configured",
      detail: "Host configured. Control transport is not connected yet.",
    });
  }

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    services,
  });
}
