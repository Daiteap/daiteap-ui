module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set("vue", "@vue/compat");
    // config.module
    //   .rule("vue")
    //   .use("vue-loader")
    //   .tap((options) => {
    //     return {
    //       ...options,
    //       compilerOptions: {
    //         compatConfig: {
    //           MODE: 2,
    //         },
    //       },
    //     };
    //   });
    // config.module
    //   .rule("vue")
    //   .use("bootstrap-vue")
    //   .tap((options) => {
    //     return {
    //       ...options,
    //       compilerOptions: {
    //         compatConfig: {
    //           MODE: 2,
    //         },
    //       },
    //     };
    //   });

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

