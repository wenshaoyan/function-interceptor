const Interceptor = require('../index');
class Test {
	constructor() {

	}
	func1(params){
		console.log('func1 start');
		return params + 1;
	}
	static func2(params) {
		console.log('func2 start');
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(params + 1);
			},1000)
		})
	}
}
const interceptor = new Interceptor(Test);
interceptor.monitorPrototypeName('func1',function (data) {
	console.log(data.name + ' before');
});
interceptor.monitorStaticAll(function (data) {
	console.log(data.name + ' before');
},function (data) {
	console.log(data.name + ' after,result=', data.result);
},true);
interceptor.release();
const test = new Test();
console.log('===============', test.func1(1));
(async function () {
    console.log(await Test.func2(2));
})();
// output -----
// func1 before
// func2 before
// func1 start
// func2 start
// func1 after,result= 2
// func2 after,result= 3
