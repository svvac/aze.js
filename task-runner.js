/* Copyright 2016 Simon `svvac` Wachter (_@svvac.net)

 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENaze.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const aze = require('./index');

class TaskRunner  {
    constructor(fn, config) {
        this.fn = fn || (v => v);
        this._queue = [];
        this._pending = [];

        this._config = {};
        this._config.timeout = aze.get(config, 'timeout', null);
        this._config.timeout_clear = aze.get(config, 'timeout_clear', 'start');
    }

    push(job, metadata, timeout, timeout_clear) {
        const q = {
            job, metadata,
            timeout: timeout === undefined ? this._config.timeout : timeout,
            timeout_clear: timeout_clear === undefined ? this._config.timeout_clear : timeout_clear,
        };

        this._queue.push(q);

        q.p = new Promise ((res, rej) => {
                q.resolve = res;
                q.reject = rej;
            })
            .then(
                v => {
                    this._clear_job(q);
                    return v;
                },
                e => {
                    this._clear_job(q);
                    throw e;
                }
            )
        ;

        if (q.timeout > 0) {
            q.timeout_handle = setTimeout(() => {
                delete q.timeout;
                delete q.timeout_handle;
                delete q.timeout_clear;
                q.p.cancel('timeout');
            }, q.timeout);
        }

        q.p.cancel = (reason) => {
            return this.cancel_job(q.p, reason);
        };

        return q.p;
    }

    run() {
        if (this._queue.length > 0) {
            let idx = this._find_next_job();
            if (!(idx in this._queue)) throw new Error('Invalid job ${idx}');

            let q = this._queue[idx];
            this._queue.splice(idx, 1);

            this._pending.push(q);

            if (q.timeout_clear === 'start')
                this._clear_timeout(q);

            try {
                q.resolve(this.fn(q.job, q.metadata));
            } catch (e) {
                q.reject(e);
            }
        }

        return this._queue.length;
    }

    cancel(matcher, reason) {
        matcher = matcher || (() => true);
        return this._queue
            .filter(q => matcher(q.metadata))
            .map(q => {
                    this.cancel_job(q.p, reason);
                return q.p;
            })
        ;
    }

    cancel_job(p, reason) {
        let q = this._find_job(p);

        if (!q) return;

        this._clear_job(q);

        q.reject(reason || cancel);
    }

    _clear_job(q) {
        this._clear_timeout(q);

        let i;
        i = this._pending.indexOf(q);
        if (i > -1) this._pending.splice(i, 1);

        i = this._queue.indexOf(q);
        if (i > -1) this._queue.splice(i, 1);
    }

    _clear_timeout(q) {
        if (q.timeout_handle) {
            clearTimeout(q.timeout_handle);
            delete q.timeout;
            delete q.timeout_handle;
            delete q.timeout_clear;
        }
    }

    // Override to customize.
    _find_next_job() {
        // FIFO
        return 0;
    }

    _find_job(p) {
        let q;

        q = this._queue.find(job => job.p === p);
        if (q) return q;

        q = this._pending.find(job => job.p === p);
        if (q) return q;

        return null;
    }
}

module.exports = TaskRunner;

