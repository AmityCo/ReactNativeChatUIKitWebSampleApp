module.exports = {
    plugins: [
      require('postcss-nested'), // This plugin will handle nested rules
      require('postcss-preset-env')({
        stage: 0, // Allows you to use the latest CSS features
      })
    ]
  };
  