# function-interceptor
Javascript 函数拦截器

## Installation

```bash
$ npm install function-interceptor
```
## 创建拦截器对象
 object为对应的监听对象
const interceptor = new Interceptor(object,type,key);
```text
object: 必填 监听的对象
type: 必填 类型,包含下面三种类型
    class: 通过class或原型+构造函数创建的对象
    factory: 通过工厂模式创建的一级嵌套对象
    story: 通过工厂模式创建的二级嵌套对象
key: 可选 当type=story时候对应的方法的key 默认值为resolve

```

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

```

### 监听通过工厂模式创建的一级嵌套对象的函数
```js
const Interceptor = require('function-interceptor');
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

const interceptor = new Interceptor(jsonObject, 'json');
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

```
### 监听通过工厂模式创建的二级嵌套对象的函数 如graphql
```js
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

const interceptor = new Interceptor(jsonObject, 'story');
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


```

## method
name: 方法名称
beforeCallback: 调用方法前执行的的回调函数 支持基于promise异步操作
afterCallback: 调用方法后执行的的回调函数 支持基于promise异步操作 
isAsync: 函数为异步执行 执行时候需要 await 或者then进行执行 
返回值: 设置成功 返回true 失败false

### monitorPrototypeName(name, beforeCallback, afterCallback, isAsync) 
按指定名称对原型方法进行监听

### monitorPrototypeRe(re, beforeCallback, afterCallback, isAsync)
按正则表达式对原型方法名称进行监听 

### monitorPrototypeAll(name, beforeCallback, afterCallback, isAsync)
所有原型方法进行监听 


### monitorStaticName(name, beforeCallback, afterCallback, isAsync)
按指定名称对静态方法进行监听

### monitorStaticRe(re, beforeCallback, afterCallback, isAsync)
按正则表达式对静态方法名称进行监听 

### monitorStaticAll(name, beforeCallback, afterCallback, isAsync)
所有静态方法进行监听

### monitorAll(beforeCallback, afterCallback, isAsync)
匹配所有的方法

### release()
删除monitor原型方法