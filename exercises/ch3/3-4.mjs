import { EventEmitter } from 'events';

function ticker(num, cb) {
    const emitter = new EventEmitter();

    // process.nextTick(() => tick(-1))

    function tick(ticks) {
        const ms = Date.now();
        if (ms % 5 === 0) {
            console.log(ms);

            const err = new Error('divide 5 error');
            
            process.nextTick(() => emitter.emit('error', err));
            return err;
        }
        else {
            emitter.emit('tick', ticks)
            return ticks;
        }
    }

    function recur(num, ticks, cb) {
        if (num <= 0) {
            return cb(null, ticks);
        }

        let result = tick(ticks);
        if (result instanceof Error) {
            return cb(result, ticks);
        }

        setTimeout(() => {
            recur(num-50, ticks+1, cb);
        }, 50)
    }

    recur(num, 0, cb);
    
    return emitter;
}

ticker(500, (err, ticks) => {
    if (err) {
        console.error('from callback ', err.toString())
    }
    else {
        console.log(`${ticks} times emitted`);
    }
}).on('tick', (ticks) => console.log(`${ticks} tick`))
.on('error', err => console.error('from event ', err.toString()));