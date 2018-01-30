const Interceptor = require('../index');
class Test {
	constructor() {

	}
	func1(params){
		console.log(params);
	}
	static func2(params) {
		console.log(params);
	}
}
const interceptor = new Interceptor(Test);
interceptor.monitorPrototypeName('func1',function (data) {
	console.log(data.name + ' before');
},function (data) {
	console.log(data.name + ' after');
});
interceptor.monitorStaticAll(function (data) {
	console.log('static before');
},function (data) {
	console.log('static after');
});
const test = new Test();
test.func1('func1 start');
console.log('\n')
Test.func2('func2 start')