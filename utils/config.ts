import "dotenv/config";
import { Config } from "../interfaces/Config";

let config: Config;

try {
  config = require("../config.json");
} catch (error) {
  config = {
    TOKEN: process.env.TOKEN || "",
    MAX_PLAYLIST_SIZE: parseInt(process.env.MAX_PLAYLIST_SIZE!) || 10,
    PRUNING: process.env.PRUNING === "true" ? true : false,
    STAY_TIME: parseInt(process.env.STAY_TIME!) || 30,
    DEFAULT_VOLUME: parseInt(process.env.DEFAULT_VOLUME!) || 100,
    LOCALE: process.env.LOCALE || "en",
    INVIDIOUS_BASE_URL: process.env.INVIDIOUS_BASE_URL || "https://inv.nadeko.net",
    USE_INVIDIOUS_PROXY: process.env.USE_INVIDIOUS_PROXY === "true" ? true : false
  };
}

export { config };
