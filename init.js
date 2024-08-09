#!/usr/bin/env node

/**
 * @file Initializes a new project by cloning the specified GitHub repository and installing dependencies.
 * @module init
 */

const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

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
 * The main function to initialize a new project by cloning the specified repository.
 *
 * @param {string} targetDir - The name of the target directory where the project will be initialized.
 */
function main(targetDir) {
	// Check if the target directory is provided
	if (!targetDir) {
		console.error("Please specify the target directory")
		process.exit(1)
	}

	const targetPath = path.resolve(process.cwd(), targetDir)

	// Check if the target directory already exists
	if (fs.existsSync(targetPath)) {
		console.error(`The directory ${targetPath} already exists.`)
		process.exit(1)
	}

	// URL of your GitHub repository
	const repoUrl = "https://github.com/LebCit/blog-doc.git"

	try {
		// Clone the repository
		execSync(`git clone ${repoUrl} ${targetPath}`, { stdio: "inherit" })
		console.log(`Project initialized at ${targetPath}`)

		// Change to the project directory and install dependencies
		process.chdir(targetPath)
		execSync("npm install", { stdio: "inherit" })

		console.log("Dependencies installed. You are ready to go!")
	} catch (error) {
		console.error("Failed to clone the repository or install dependencies", error)
	}
}

// Check Node.js version
checkNodeVersion()

// Get the target directory from command line arguments and run the main function
main(process.argv[2])
