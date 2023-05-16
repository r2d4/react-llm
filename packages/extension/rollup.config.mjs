import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: "src/background/index.js", // Replace with the path to your background script
  output: {
    file: "build/background.bundle.js", // Replace with the desired output path and filename
    format: "iife",
  },
  external: ["react", "react-dom"],
  plugins: [
    resolve({
      browser: true,
      esmoduleInterop: true,
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
    babel({
      babelHelpers: "bundled",
      presets: [["@babel/preset-env", { modules: false }]],
    }),
  ],
};
