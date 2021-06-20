const path = require("path");
const fs = require("fs");
const glob = require("glob");

function cleanPlugin({ patterns, cwd, verbose = false, dry = false } = {}) {
  const plugin = {
    name: "CleanPlugin",
    setup(build) {
      if ((!patterns || !patterns.length) && !build.initialOptions.outdir) {
        return;
      }
      const targets = patterns || [path.resolve(cwd || process.cwd(), build.initialOptions.outdir, "*")];
      const globOptions = cwd ? { cwd } : undefined;
      targets.forEach((target) => {
        const matches = glob.sync(target, globOptions);
        matches.forEach((match) => {
          if (dry) {
            console.info(`[${plugin.name}] :: Would have deleted ${match}`);
          } else {
            try {
              fs.unlinkSync(match);
            } catch (e) {
              console.error(`[${plugin.name}] :: Failed to delete ${match}`);
            } finally {
              if (verbose) {
                console.info(`[${plugin.name}] :: Deleted ${match}`);
              }
            }
          }
        });
      });
    },
  };
  return plugin;
}

module.exports = cleanPlugin;
