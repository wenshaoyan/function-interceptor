# function-interceptor
Javascript 函数拦截器

## Installation

```bash
$ npm install function-interceptor
```

## Usage

### 监听Array
```js
const Interceptor = require('function-interceptor');

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
```

### 监听自定义对象
```js
const Interceptor = require('function-interceptor');
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
```