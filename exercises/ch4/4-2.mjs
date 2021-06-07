import { join } from 'path'
import { readdir } from 'fs';

function listNestedFiles(dir, cb) {
    const result = [];

    let running = 0;

    function recur(dir) {
        running+=1;

        readdir(dir, {withFileTypes: true}, (err, dirs) => {
            if (err) {
                return cb(err, result);
            }

            dirs.forEach((d) => {  
                if (d.isDirectory()) {
                    recur(join(dir, d.name))
                }
                else {
                    result.push(d)
                }
            });

            running -= 1;

            if (running === 0) {
                return cb(null, result)
            }
        });
    }

    recur(dir);
}

listNestedFiles('./', (err, result) => console.log(result))