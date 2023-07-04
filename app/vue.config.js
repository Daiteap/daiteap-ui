module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set("vue", "@vue/compat");

    config.entryPoints.delete("app");
  },

  // Overriding webpack config
  configureWebpack: {
    entry: {
      app: "./src/main.js",
    },
  },

  // disable cache
  lintOnSave: true,
  filenameHashing: true,
};

