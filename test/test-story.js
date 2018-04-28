const Interceptor = require('../index');
const jsonObject = {
    queryData: {
        name: 'query',
        description: '查询某个数据',
        resolve(){
            return 'yes';
        }
    }

};
const interceptor = new Interceptor(jsonObject, 'story','resolve');
interceptor.monitorStaticName('queryData', function ({name, args}) {
    console.log(name, args);
}, function ({name, args, result}) {
    console.log(name, args, result);
}, false);


interceptor.release();


jsonObject.queryData.resolve(123);
// output -----
// queryData { '0': 123 }
// queryData { '0': 123 } yes

