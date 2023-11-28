const fs = require("fs");
const fse = require("fs-extra");
const archiver = require("archiver");

const CURRENT_DIRECTORY = __dirname;

const colors = {
    reset: "\x1b[0m",
    fg: {
        black: "\x1b[30m",
    },
    bg: {
        green: "\x1b[42m",
        red: "\x1b[41m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
    },
};

/**
 * Print message to console
 * @param {string} text console text
 * @param {string} type - success [success, warning, error]
 */
function print(text, type = "success") {
    let bg = colors.bg.green;
    let fg = colors.fg.black;

    if (type === "info") bg = colors.bg.blue;
    if (type === "warning") bg = colors.bg.yellow;
    if (type === "error") bg = colors.bg.red;

    console.log(bg, fg, text, colors.reset);
    console.log("");
}

print("extracting plugin ...", "info");

/**
 * Get build folder dashboard
 */
if (!fs.existsSync(CURRENT_DIRECTORY + "/dashboard")) {
    print(
        "/dashboard directory not found. First build with npm run build, then run this command",
        "error"
    );
    process.exit(1);
}

// Create a new folder
fs.mkdirSync(CURRENT_DIRECTORY + "/plugin");
print("created new folder '/plugin'");

/**
 * Copy xynity-blocks.php
 */
fse.copySync(
    CURRENT_DIRECTORY + "/xynity-blocks.php",
    CURRENT_DIRECTORY + "/plugin/xynity-blocks.php",
    {
        overwrite: true,
    }
);
print("copied xynity-blocks.php");

/**
 * Copy uninstall.php
 */
fse.copySync(
    CURRENT_DIRECTORY + "/uninstall.php",
    CURRENT_DIRECTORY + "/plugin/uninstall.php",
    {
        overwrite: true,
    }
);
print("copied uninstall.php");

/**
 * Copy LICENSE
 */
fse.copySync(
    CURRENT_DIRECTORY + "/LICENSE",
    CURRENT_DIRECTORY + "/plugin/LICENSE",
    {
        overwrite: true,
    }
);
print("copied LICENSE");

/**
 * Copy README.md
 */
fse.copySync(
    CURRENT_DIRECTORY + "/README.md",
    CURRENT_DIRECTORY + "/plugin/README.md",
    {
        overwrite: true,
    }
);
print("copied README.md");

/**
 * Copy includes folder
 */
fse.copySync(
    CURRENT_DIRECTORY + "/includes/",
    CURRENT_DIRECTORY + "/plugin/includes/",
    {
        overwrite: true,
    }
);
print("copying files in /plugin/includes/ from /includes done");

/**
 * Copy blocks folder
 */
fse.copySync(
    CURRENT_DIRECTORY + "/blocks/build/",
    CURRENT_DIRECTORY + "/plugin/blocks/build/",
    {
        overwrite: true,
    }
);
print("copying files in /plugin/blocks/build from /plugin/blocks/build done");

/**
 * Copy dashboard folder
 */
fse.copySync(
    CURRENT_DIRECTORY + "/dashboard/",
    CURRENT_DIRECTORY + "/plugin/dashboard/",
    {
        overwrite: true,
    }
);
print("copying files in /plugin/dashboard/ from /dashboard done");

print("creating xynity-blocks.zip", "info");

let output = fs.createWriteStream("xynity-blocks.zip");
let archive = archiver("zip");

output.on("close", function () {
    print(archive.pointer() + " total bytes", "info");
    print("Creating xynity-blocks.zip done");
});

archive.on("error", function (err) {
    throw err;
});

archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
archive.directory(CURRENT_DIRECTORY + "/plugin/", false);

archive.finalize();
