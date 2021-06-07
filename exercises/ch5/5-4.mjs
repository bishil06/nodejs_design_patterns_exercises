function mapAsync (iterable, cb, concurrency) {
    let result = [];
    const taskQueue = [];
    let running = 0;

    function wrapTask(task) {
        const p = new Promise((resolve, reject) => {
            taskQueue.push(() => task().then(resolve, reject));
        });

        result.push(p);
        return p;
    }

    function next() {
        while (running < concurrency && taskQueue.length) {
            const task = taskQueue.shift();
            task().finally(() => {
                running -= 1;
                next();
            })
            running += 1;
        }
    }

    iterable.forEach(item => wrapTask(() => cb(item)));

    next();

    return Promise.all(result);
  }
  

  mapAsync([1,2,3,4,5], async (n) => n*2, 3).then(console.log);