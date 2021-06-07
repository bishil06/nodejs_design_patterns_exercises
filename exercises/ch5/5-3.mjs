export class TaskQueuePC {
    constructor (concurrency) {
      this.taskQueue = []
      this.consumerQueue = []
  
      // spawn consumers
      for (let i = 0; i < concurrency; i++) {
        this.consumer()
      }
    }
  
    consumer () {
        const recur = () => {
            return this.getNextTask()
                .then(task => task())
                .catch(err => console.error(err))
        }

        recur().then(recur)
    }
  
    getNextTask () {
      return new Promise((resolve) => {
        if (this.taskQueue.length !== 0) {
          return resolve(this.taskQueue.shift())
        }
  
        this.consumerQueue.push(resolve)
      })
    }
  
    runTask (task) {
      return new Promise((resolve, reject) => {
        const taskWrapper = () => {
          const taskPromise = task()
          taskPromise.then(resolve, reject)
          return taskPromise
        }
  
        if (this.consumerQueue.length !== 0) {
          // there is a sleeping consumer available, use it to run our task
          const consumer = this.consumerQueue.shift()
          consumer(taskWrapper)
        } else {
          // all consumers are busy, enqueue the task
          this.taskQueue.push(taskWrapper)
        }
      })
    }
  }


  async function test() {
    console.log('hi');
    return 1;
}
  
  const taskQ = new TaskQueuePC(3)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)
  taskQ.runTask(test)