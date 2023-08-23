'use strict';

const path = require('path');
const fs = require('fs-extra');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const main = async () => {
  try {
    // Ensure .nyc_output directory exists
    await fs.ensureDir(resolveApp('.nyc_output'));
    console.log('Created .nyc_output directory');

    // Also ensure all other coverage directories exist
    await fs.ensureDir(resolveApp('coverage/cypress'));
    await fs.ensureDir(resolveApp('coverage/jest'));
    await fs.ensureDir(resolveApp('coverage/merged'));
    await fs.ensureDir(resolveApp('coverage/tmp'));
    console.log('Created all coverage directories');
  } catch (err) {
    console.error('Error ensuring coverage directories exist:', err);
    process.exit(1);
  }
};

main();