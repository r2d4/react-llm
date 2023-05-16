import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import OMT from "@surma/rollup-plugin-off-main-thread";
import dts from "rollup-plugin-dts";
import typescript from "rollup-plugin-typescript2";
const name = "dist/index";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
});

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
    },
    external: ["react", "react-dom"],
    plugins: [
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react", "@babel/preset-typescript"],
        babelHelpers: "bundled",
      }),
      nodeResolve(),
      typescript({
        tsconfig: "tsconfig.json",
        sourceMap: false,
        useTsconfigDeclarationDir: true,
      }),
      OMT(),
      commonjs(),
      resolve({ preferBuiltins: true }),
      json(),
    ],
  },
  bundle({
    plugins: [
      dts({
        compilerOptions: {
          composite: false,
        },
      }),
    ],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];

// export default [
//   {
//     input: "src/index.ts",
//     output: {
//       dir: "dist",
//       format: "esm",
//       sourceMap: true,
//     },
//     external: ["react", "react-dom"],
//     plugins: [
//       babel({
//         exclude: "node_modules/**",
//         presets: ["@babel/preset-react", "@babel/preset-typescript"],
//         babelHelpers: "bundled",
//       }),
//       nodeResolve(),
//       typescript({
//         tsconfig: "tsconfig.json",
//         sourceMap: false,
//         useTsconfigDeclarationDir: true,
//       }),
//       OMT(),
//       commonjs(),
//       resolve({ preferBuiltins: true }),
//       json(),
//     ],
//   },
// ];
