import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["js/viewer.js"],
  bundle: true,
  format: "iife",
  outfile: "js/view.bundle.js",
  nodePaths: ["tools/node_modules"],
  legalComments: "none",
});
