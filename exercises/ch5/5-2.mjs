export class TaskQueue {
    constructor (concurrency) {
      this.concurrency = concurrency
      this.running = 0
      this.queue = []
    }
  
    runTask (task) {
      return new Promise((resolve, reject) => {
        this.queue.push(() => {
          return task().then(resolve, reject)
        })
        process.nextTick(this.next.bind(this))
      })
    }
  
    next () {
      while (this.running < this.concurrency && this.queue.length) {
        const task = this.queue.shift();

        (async () => {
            await task();
            this.running -= 1;
            this.next();
        })()
        this.running +=1;
      }
    }
  }

  async function test() {
      console.log('hi');
      return 1;
  }

  const taskQ = new TaskQueue(3)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)