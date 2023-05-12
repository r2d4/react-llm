import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import OMT from "@surma/rollup-plugin-off-main-thread";
import typescript from "rollup-plugin-typescript2";

export default [
  // ES Modules bundle
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
    },
    external: ["react", "react-dom"],
    plugins: [
      typescript({ tsconfig: "tsconfig.json" }),
      nodeResolve(),
      OMT(),
      commonjs(),
      resolve({ preferBuiltins: true }),
      json(),
    ],
  },
];
