import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["js/viewer.js"],
  bundle: true,
  format: "iife",
  minify: true,
  outfile: "js/view.bundle.js",
  nodePaths: ["tools/node_modules"],
  legalComments: "none",
});
