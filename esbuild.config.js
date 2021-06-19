const path = require("path");
const { serve, build } = require("esbuild");

const args = process.argv.slice(2);

const flags = {
  prod: args.includes("prod"),
  serve: args.includes("serve"),
};

const paths = {
  src: path.join(__dirname, "src"),
  dist: path.join(__dirname, "dist"),
};

const buildOptions = {
  entryPoints: {
    bundle: path.join(paths.src, "main.tsx"),
  },
  entryNames: flags.prod ? "[name].[hash]" : "[name]",
  chunkNames: flags.prod ? "[name].[hash]" : "[name]",
  outdir: paths.dist,
  bundle: true,
  minify: flags.prod,
  sourcemap: flags.prod ? "external" : "inline",
  logLevel: "info",
  incremental: flags.serve,
  target: "es6",
  write: !flags.serve,
};

const serveOptions = { host: "localhost", port: 8000 };

if (flags.serve) {
  serve(serveOptions, buildOptions).catch(() => process.exit(1));
} else {
  build(buildOptions).catch(() => process.exit(1));
}
