import { readFile, appendFile } from 'fs';

function concatFiles(fcb, dest, ...srcs) {
    let readers = srcs.map(src => {
        return (cb) => {
            readFile(src, (err, data) => {
                if (err) throw err;
                else cb(null, data);
            })
        }
    })

    let index = 0;

    function read() {
        return readers[index]((err, data) => {
            if (err) throw err;

            return appendFile(dest, data, (err) => {
                if (err) throw err;

                index+=1;

                if (index == readers.length) {
                    return fcb()
                }
                else {
                    return read()
                }
            });
        })
    }

    read()
}

concatFiles(() => console.log('finish'), 'foobar.txt', 'foo.txt', 'bar.txt')