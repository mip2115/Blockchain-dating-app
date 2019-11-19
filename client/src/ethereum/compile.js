const path = require("path");
const solc = require("solc");

// file system.  Gives us access to file-system on local copmuter
const fs = require("fs-extra");

// delete the build folder if it already exists
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const datePath = path.resolve(__dirname, "contracts", "DateApp.sol");
const source = fs.readFileSync(datePath, "utf8");
const output = solc.compile(source, 1).contracts;

// recreate build dir
// if it doesn't exist, create it
fs.ensureDirSync(buildPath);

console.log(output);

// iterate over the keys (contracts) of the object
for (let contract in output) {
  fs.outputJsonSync(
    // write out a JSOn file to a specified folder
    // remove the :
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract] // write this out
  );
}
