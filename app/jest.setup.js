// you need this to reformat the console.error
import {format} from "util";
process.on("unhandledRejection", (error) => {
  // Will print "unhandledRejection err is not defined"
  console.error("unhandledRejection", error.message);
});

// this call will be set before every test
beforeEach(() => {
  global.console.error = (...args) => {
    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if (
        typeof arg === "string" &&
        (arg.includes("Vue warn") || arg.includes("unhandledRejection"))
      ) {
        throw new Error(format(...args));
      }
    }
  };
});
