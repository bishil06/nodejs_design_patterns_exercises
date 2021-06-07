import { readdir, readFile } from "fs";
import { join } from "path/posix";

function recursiveFind(dir, keyword, cb) {
    let result = [];

    let readCount = 0;

    function recur(innerDir) {

        readdir(innerDir, {withFileTypes: true}, (err, files) => {

            files.forEach(file => {
                const p =join(innerDir, file.name);
                if (file.isDirectory()) {
                    return recur(p)
                }
                else {
                    readCount += 1;

                    return readFile(p, (err, data) => {
                        let myRegEx = new RegExp(keyword);
                        if (data.toString().match(myRegEx)) {
                            result.push(p)
                        }

                        readCount -= 1;
                        if (readCount === 0 )
                            return cb(null, result)
                    })
                }
            })
        })
    }

    recur(dir)
}

recursiveFind('./', 'batman', (err, result) => console.log(result))