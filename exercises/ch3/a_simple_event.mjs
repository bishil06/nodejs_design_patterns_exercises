import { EventEmitter } from 'events';
import { readFile } from 'fs';

class FindRegex extends EventEmitter {
    constructor(regex) {
        super();
        this.regex = regex;
        this.files = [];
        this.cached = new Map();
    }

    addFile(file) {
        this.files.push(file);
        return this;
    }

    find() {
        process.nextTick(() => this.emit('find start', this.files))

        for(const file of this.files) {
            this.emit('file read', file);

            const cached = this.cached.get(file);
            if (cached !== undefined) {
                const matchs = cached;
                if (matchs) {
                    matchs.forEach(e => this.emit('found', file, e));
                }
                continue;
            }

            readFile(file, 'utf8', (err, content) => {
                if (err) this.emit('error', err);
                const matchs = content.match(this.regex);
                this.cached.set(file, matchs);
                if (matchs) {
                    matchs.forEach(e => this.emit('found', file, e));
                }
            });
        }

        return this;
    }
}

const findHello = new FindRegex(/hello \w+/);
findHello
    .addFile('a.txt')
    .addFile('b.txt')
    .find()
    .on('find start', files => console.log(`find start ${files}`))
    .on('found', (file, e) => console.log(`found ${file} content = ${e}`))
    .on('error', console.error)