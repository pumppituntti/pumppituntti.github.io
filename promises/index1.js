var readlineSync = require("readline-sync");
const fs = require("fs");

let path = readlineSync.question("Give file name: ");
function fileReader(resolve, reject) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      reject("ERROR");
    } else {
      console.log("The content of the file is:");
      resolve(data);
    }
  });
}
const p = new Promise(fileReader);

p
.then((value) => console.log(value))
.catch((errormsg) => console.log(errormsg));
