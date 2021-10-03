var readlineSync = require("readline-sync");
const fs = require("fs");

let path = readlineSync.question("Give file name: ");
function fileReader(resolve, reject) {
  fs.readFile(path, "utf8", (err, data) => {
    try {
      var obj = JSON.parse(data);
      if (!("name" in obj)) {
        reject(`file ${path} contains json, but not property name`);
      }
      resolve(obj.name);
    } catch (error) {
      if (error instanceof SyntaxError) {
        if (err) {
          reject(`ERROR, file ${path} does not exist`);
        } else {
          reject(`ERROR, file ${path} does not contain json`);
        }
      } else {
        reject("Unknown error");
      }
    }
  });
}
const p = new Promise(fileReader);

p.then((value) => console.log(value)).catch((errormsg) =>
  console.log(errormsg)
);
