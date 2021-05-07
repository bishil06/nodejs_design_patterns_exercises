import { EventEmitter } from 'events';

const DivisibleBy5Error = new Error("Timestamp divisible by 5.")

function ticker(num, cb) {
    const emitter = new EventEmitter();

    process.nextTick(() => emitter.emit('tick', -1));

    function recur(num, ticks, cb) {
        if (Date.now() % 5 === 0) {
            console.log(Date.now());
            process.nextTick(() => emitter.emit('error', DivisibleBy5Error))
            return cb(DivisibleBy5Error, ticks);
        }
        if (num <= 0) {
            return cb(null, ticks);
        }

        setTimeout(() => {
            emitter.emit('tick', ticks);
            recur(num-50, ticks+1, cb);
        }, 50);
    }

    try {
        process.nextTick(() => recur(num, 0, cb));
    }
    catch (err) {
        cb(err, null);
        return emitter;
    }

    return emitter;
}

ticker(500, (err, ticks) => {
    if (err) console.error('error: ', err.message);
    console.log(`call cb - emitted ${ticks}`);
})
.on('tick', (ticks) => console.log('tick', ticks))
.on('error', err => console.error(err.message))