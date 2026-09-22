const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,

  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader(
        "Cross-Origin-Opener-Policy",
        "same-origin-allow-popups"
      );

      return middleware(req, res, next);
    };
  },
};

module.exports = config;