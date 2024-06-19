module.exports = function (api) {
  api.cache(false);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          // Do not transform modules if Webpack is handling them
          modules: false,
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
        },
      ],
    ],
  };
};
