const Interceptor = require('../index');


class Log {
    info() {
        console.log('=========');
    }
}

const interceptor = new Interceptor(Log);
interceptor.monitorPrototypeName('info',  function(data) {
    const error = new Error();
    console.log(error.stack,error.stack.split(/\n\s+/));

});
interceptor.release();
(function () {
    const log = new Log();
    const ctx = {ctx: true};
    log.info(arguments);
})()
// main();
var x =
    {
        run() {
            const log = new Log();
            log.info('');
        }
    }
console.log(x.run());

class Test{
    constructor(){

    }
    a() {
        var yanshaowen = {a:1};
        const log = new Log();
        log.info(this);
    }
}

function main() {
    const test = new Test();
    test.a()
}
main();


