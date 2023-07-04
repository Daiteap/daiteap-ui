module.exports = function(webpackEnv) {
  return {
    resolve: {
      fallback: {
        "assert": require.resolve("assert"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
      },
    },
  };
};
