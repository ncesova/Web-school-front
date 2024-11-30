const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Game {
  id: string;
  name: string;
  url?: string;
}

const GAME_URLS: Record<string, string> = {
  Agent: "agent",
  Pet: "pet",
  Robot: "robot",
  Space: "space",
  Testing: "testing",
};

export const gameService = {
  getAllGames: async (): Promise<Game[]> => {
    console.log("Fetching games...");
    const response = await fetch(`${API_URL}/games`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.statusText}`);
    }

    const games = await response.json();
    console.log("Received games:", games);

    const lessonId = window.location.pathname.split("/")[2];

    const gamesWithUrls = games.map((game: Game) => {
      console.log(`Checking game: ${game.name}, URL: ${GAME_URLS[game.name]}`);
      return {
        ...game,
        url: GAME_URLS[game.name]
          ? `/lesson/${lessonId}/${GAME_URLS[game.name]}`
          : undefined,
      };
    });

    console.log("Games with URLs:", gamesWithUrls);
    return gamesWithUrls;
  },
};
