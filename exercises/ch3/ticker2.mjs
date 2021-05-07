import { EventEmitter } from 'events';

function ticker(num, cb) {
    const emitter = new EventEmitter();

    process.nextTick(() => emitter.emit('tick', -1));

    function recur(num, ticks, cb) {
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
    if (err) return console.error('error: ', err.message);
    console.log(`emitted ${ticks}`);
})
.on('tick', (ticks) => console.log('tick', ticks))