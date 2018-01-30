const Interceptor = require('../index');

const interceptor = new Interceptor(Array);
interceptor.monitorPrototypeName('push',function (data) {
	console.log(data.name + ' before');
},function (data) {
	console.log(data.name + ' after');
});
interceptor.release();

const list = [1];

list.push('2');
console.log(list.toString())