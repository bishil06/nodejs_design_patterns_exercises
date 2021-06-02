import { EventEmitter } from 'events';

function ticker(num, cb) {
    const emitter = new EventEmitter();

    function recur(num, ticks, cb) {
        if (num <= 0) {
            return cb(null, ticks);
        }

        setTimeout(() => {
            emitter.emit('tick', ticks)
            recur(num-50, ticks+1, cb);
        }, 50)
    }

    try {
        recur(num, 0, cb);
    }
    catch (err) {
        cb(err, null);
        return emitter;
    }
    
    return emitter;
}

ticker(500, (err, ticks) => {
    if (err) console.error(err)
    else {
        console.log(`${ticks} times emitted`);
    }
}).on('tick', (ticks) => console.log(`${ticks} tick`))