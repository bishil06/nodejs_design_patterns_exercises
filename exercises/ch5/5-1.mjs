function promiseAll(...promises) {
    let done = 0;

    return new Promise((resolve, reject) => {
        let result = [];

        promises.forEach((p, i) => p.then((v) => {
            done += 1;
            
            result[i] = v;

            if (done === promises.length) {
                return resolve(result)
            }
        }))
    })
}

async function test() {
    console.log('test')
    return 1;
}

promiseAll(test(), test(), test(), test()).then(console.log)