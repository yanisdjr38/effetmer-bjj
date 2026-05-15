import morgan from "morgan";
import logger from "../utils/logger.js";

// Create a stream object with a 'write' function that will be used by morgan
const stream = {
  write: (message) => {
    // Log only non-health-check requests
    if (!message.includes("/health")) {
      logger.info(message.trim());
    }
  },
};

export const morganMiddleware = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
  { stream },
);

export default morganMiddleware;
