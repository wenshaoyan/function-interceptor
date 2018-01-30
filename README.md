# function-interceptor
Javascript 函数拦截器

## Installation

```bash
$ npm install function-interceptor
```
## 创建拦截器对象
 object为对应的监听对象
const interceptor = new Interceptor(Object);
## 添加完监视器后把添加的原型方法删除
interceptor.release();
 
## example

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
},function (data) {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log(data.name + ' after,result=', data.result);
			resolve();
		},1000)
	})
});
interceptor.monitorStaticAll(function (data) {
	console.log(data.name + ' before');
},function (data) {
	console.log(data.name + ' after,result=', data.result);
});
interceptor.release();
const test = new Test();
test.func1(1);
Test.func2(2);
// output -----
// func1 before
// func2 before
// func1 start
// func2 start
// func1 after,result= 2
// func2 after,result= 3

```


## method
name: 方法名称
beforeCallback: 调用方法前执行的的回调函数 支持基于promise异步操作
afterCallback: 调用方法后执行的的回调函数 支持基于promise异步操作  
返回值: 设置成功 返回true 失败false

### monitorPrototypeName(name, beforeCallback, afterCallback) 
按指定名称对原型方法进行监听

### monitorPrototypeRe(re, beforeCallback, afterCallback)
按正则表达式对原型方法名称进行监听 

### monitorPrototypeAll(name, beforeCallback, afterCallback)
所有原型方法进行监听 


### monitorStaticName(name, beforeCallback, afterCallback)
按指定名称对静态方法进行监听

### monitorStaticRe(re, beforeCallback, afterCallback)
按正则表达式对静态方法名称进行监听 

### monitorStaticAll(name, beforeCallback, afterCallback)
所有静态方法进行监听

### monitorAll(beforeCallback, afterCallback)
匹配所有的方法

### release()
删除monitor原型方法