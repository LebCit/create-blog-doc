#!/usr/bin/env node

/**
 * @file Initializes a new project by cloning the Blog-Doc repository and installing dependencies.
 * @module init
 */

const { spawnSync } = require("child_process")
const path = require("path")
const fs = require("fs")
const readline = require("node:readline/promises")

const REPO_URL = "https://github.com/LebCit/blog-doc.git"
const IS_WINDOWS = process.platform === "win32"

/**
 * Checks the Node.js version and exits if the version is less than 18.
 */
function checkNodeVersion() {
    const currentVersion = process.versions.node
    const majorVersion = parseInt(currentVersion.split(".")[0], 10)

    if (majorVersion < 18) {
        console.error(`Node.js v${currentVersion} is not supported. Please upgrade to Node.js v18 or higher.`)
        process.exit(1)
    }
}

/**
 * Checks that Git is installed and available on the PATH.
 */
function checkGit() {
    const result = spawnSync("git", ["--version"], { stdio: "ignore" })

    if (result.error || result.status !== 0) {
        console.error("Git is required but was not found. Please install Git and try again.")
        process.exit(1)
    }
}

/**
 * Checks that npm is installed and available on the PATH.
 */
function checkNpm() {
    const result = spawnSync("npm", ["--version"], { stdio: "ignore", shell: IS_WINDOWS })

    if (result.error || result.status !== 0) {
        console.error("npm is required but was not found. Please install npm and try again.")
        process.exit(1)
    }
}

/**
 * Removes the target directory. Used to clean up after a failed clone or install
 * so the user isn't left with a half-initialized project.
 *
 * @param {string} targetPath - The directory to remove.
 */
function cleanup(targetPath) {
    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true })
    }
}

/**
 * Prompts the user for a site title and description, skipping entirely
 * in non-interactive environments (e.g. CI) where stdin is not a TTY.
 *
 * @returns {Promise<{ title: string, description: string }|null>} The answers, or null if skipped.
 */
async function promptForSiteInfo() {
    if (!process.stdin.isTTY) {
        return null
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    try {
        console.log("\n  Let's set up your site (press Enter to skip any question):\n")
        const title = await rl.question("  Site title: ")
        const description = await rl.question("  Site description: ")
        return { title: title.trim(), description: description.trim() }
    } finally {
        rl.close()
    }
}

/**
 * Applies the user's answers to defaults/settings.defaults.json before it gets
 * copied to app/data/settings.json on first run. Only overwrites fields the
 * user actually answered; leaves everything else untouched.
 *
 * @param {string} targetPath - The project's root directory.
 * @param {{ title: string, description: string }} answers - The user's answers.
 */
function applySiteInfo(targetPath, answers) {
    if (!answers || (!answers.title && !answers.description)) {
        return
    }

    const settingsPath = path.join(targetPath, "defaults", "settings.defaults.json")

    if (!fs.existsSync(settingsPath)) {
        return
    }

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))

    if (answers.title) settings.title = answers.title
    if (answers.description) settings.description = answers.description

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4) + "\n")
}

/**
 * The main function to initialize a new project by cloning the repository,
 * personalizing it, and installing dependencies.
 *
 * @param {string} targetDir - The name of the target directory where the project will be initialized.
 */
async function main(targetDir) {
    if (!targetDir) {
        console.error("Please specify the target directory")
        process.exit(1)
    }

    const targetPath = path.resolve(process.cwd(), targetDir)

    if (fs.existsSync(targetPath)) {
        console.error(`The directory ${targetPath} already exists.`)
        process.exit(1)
    }

    // Clone the repository (shallow — no need for full history)
    const cloneResult = spawnSync("git", ["clone", "--depth=1", REPO_URL, targetPath], { stdio: "inherit" })

    if (cloneResult.status !== 0) {
        console.error("\n  Failed to clone the repository.")
        cleanup(targetPath)
        process.exit(1)
    }

    console.log(`\n  Project cloned to ${targetPath}`)

    // Personalize before install, so the scaffolded settings.json is already correct on first run
    const answers = await promptForSiteInfo()
    applySiteInfo(targetPath, answers)

    // Install dependencies
    console.log("\n  Installing dependencies...\n")
    const installResult = spawnSync("npm", ["install"], {
        cwd: targetPath,
        stdio: "inherit",
        shell: IS_WINDOWS,
    })

    if (installResult.status !== 0) {
        console.error("\n  Failed to install dependencies.")
        cleanup(targetPath)
        process.exit(1)
    }

    console.log("\n  ✔ Blog-Doc installed successfully!\n")
    console.log("  Next steps:\n")
    console.log(`    cd ${targetDir}`)
    console.log("    npm start\n")
    console.log("  Documentation: https://blog-doc.pages.dev/\n")
    console.log("  Happy blogging!\n")
}

checkNodeVersion()
checkGit()
checkNpm()

main(process.argv[2]).catch((error) => {
    console.error("\n  Initialization failed:", error.message)
    process.exit(1)
})
