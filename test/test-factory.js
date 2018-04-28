const Interceptor = require('../index');
const jsonObject = {
    query() {
        return 'yes';
    },
    move: function () {
        return new Promise(resolve => {
            resolve('yes');
        })
    }
};

const interceptor = new Interceptor(jsonObject, 'factory');
interceptor.monitorStaticName('query', function ({name, args}) {
    console.log(name, args);
}, function ({name, args, result}) {
    console.log(name, args, result);
}, false);

interceptor.monitorStaticName('move', function ({name, args}) {
    console.log(name, args);
}, function ({name, args, result}) {
    console.log(name, args, result);
}, true);

interceptor.release();


jsonObject.query(123);
jsonObject.move(123, 124);
// output -----
// query { '0': 123 }
// query { '0': 123 } yes
// move { '0': 123, '1': 124 }
// move { '0': 123, '1': 124 } yes

