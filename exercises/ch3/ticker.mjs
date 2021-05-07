import { EventEmitter } from 'events';

function ticker(num, cb) {
    const emitter = new EventEmitter();

    function recur(num, ticks, cb) {
        if (num <= 0) {
            return cb(null, ticks);
        }

        // throw new Error('oops');

        setTimeout(() => {
            emitter.emit('tick', ticks);
            recur(num-50, ticks+1, cb);
        }, 50);
    }

    try {
        recur(num, 0, cb);
    }
    catch (err) {
        cb(err);
        return emitter;
    }

    return emitter;
}

ticker(500, (err, ticks) => {
    if (err) return console.error('error: ', err.message);
    console.log(`emitted ${ticks}`);
})
.on('tick', () => console.log('tick'))