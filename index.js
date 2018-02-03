/**
 * Created by wenshaoyan 2018/1/30.
 * 拦截器
 */
'use strict';
const getFunctionName = (isAsync) => {
    return isAsync ? 'monitorAsync' : 'monitor';
};
class Interceptor {
    /**
     * 找到对应类的可监听的原型和静态方法
     * @param _clazz    监听的类
     */
    constructor(_clazz) {
        if (!(_clazz instanceof Function)) throw new Error('clazz type not is Function');
        const _prototypes = Object.getOwnPropertyNames(_clazz.prototype);
        const prototypes = [];
        for (const p of _prototypes) {
            if (p !== 'constructor') {
                prototypes.push(p);
            }
        }
        const _statics = Object.getOwnPropertyNames(_clazz);
        const statics = [];
        for (const p of _statics) {
            if (p !== 'length' && p !== 'prototype' && p !== 'name') {
                statics.push(p);
            }
        }
        this._clazz = _clazz;
        this._prototypes = new Set(prototypes);
        this._statics = new Set(statics);
        this._back = {
            p: {},
            s: {}
        };
        this.init();

    }


    get prototypes() {
        return this._prototypes;
    }

    set prototypes(value) {
        this._prototypes = value;
    }

    get statics() {
        return this._statics;
    }

    set statics(value) {
        this._statics = value;
    }

    get clazz() {
        return this._clazz;
    }

    set clazz(value) {
        this._clazz = value;
    }


    get back() {
        return this._back;
    }

    set back(value) {
        this._back = value;
    }

    /**
     * 初始化monitor和monitorAsync  默认在创建实例时候创建 也可通过实例调用
     */
    init() {
        if (typeof Function.prototype.monitor !== 'function') {
            Function.prototype.monitor = function (functionName, before, after) {
                const self = this;
                return function () {
                    if (before instanceof Function) before.call(this, {name: functionName, args: arguments});
                    const result = self.apply(this, arguments);
                    if (after instanceof Function) after.call(this, {name: functionName, args: arguments, result})
                    return result;

                };
            };
        }
        if (typeof Function.prototype.monitorAsync !== 'function') {
            Function.prototype.monitorAsync = function (functionName, before, after) {
                const self = this;
                return async function () {
                    if (before instanceof Function) await before.call(this, {name: functionName, args: arguments});
                    const result = await self.apply(this, arguments);
                    if (after instanceof Function) await after.call(this, {name: functionName, args: arguments, result})
                    return result;

                };
            };
        }

    }

    /**
     * 按指定名称对原型方法进行监听
     * @param name
     * @param _before
     * @param _after
     * @param _isAsync    是否为异步
     * @return {boolean}
     */
    monitorPrototypeName(name, _before, _after, _isAsync) {
        if (this.prototypes.has(name)) {
            this._addBackFunction('p', name, this.clazz.prototype[name]);
            this.clazz.prototype[name] = this.clazz.prototype[name][getFunctionName(_isAsync)](name, _before, _after);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 按正则表达式对原型方法名称进行监听
     * @param re
     * @param _before
     * @param _after
     * @param _isAsync
     * @return {boolean}
     */
    monitorPrototypeRe(re, _before, _after, _isAsync) {

        if (typeof re.test !== 'function') {
            return false;
        }
        this.prototypes.forEach(value => {
            if (re.test(value)) {
                this._addBackFunction('p', value, this.clazz.prototype[value]);
                this.clazz.prototype[value] = this.clazz.prototype[value][getFunctionName(_isAsync)](value, _before, _after);

            }
        });
        return true;
    }

    /**
     * 所有原型方法进行监听
     * @param _before
     * @param _after
     * @param _isAsync
     * @return {boolean}
     */
    monitorPrototypeAll(_before, _after, _isAsync) {
        this.prototypes.forEach(value => {
            this._addBackFunction('p', value, this.clazz.prototype[value]);
            this.clazz.prototype[value] = this.clazz.prototype[value][getFunctionName(_isAsync)](value, _before, _after)
        });
        return true;
    }

    /**
     * 按指定名称对静态方法进行监听
     * @param name
     * @param _before
     * @param _after
     * @param _isAsync
     * @return {boolean}
     */
    monitorStaticName(name, _before, _after, _isAsync) {
        if (this.statics.has(name)) {
            this._addBackFunction('s', name, this.clazz[name]);
            this.clazz[name] = this.clazz[name][getFunctionName(_isAsync)](name, _before, _after);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 按正则表达式对静态方法名称进行监听
     * @param re
     * @param _before
     * @param _after
     * @param _isAsync
     * @return {boolean}
     */
    monitorStaticRe(re, _before, _after, _isAsync) {
        if (re.test instanceof Function) {
            return false;
        }
        this.statics.forEach(value => {
            this._addBackFunction('s', value, this.clazz[value]);
            if (re.test(value)) this.clazz[value] = this.clazz[value][getFunctionName(_isAsync)](value, _before, _after);
        });
        return true;
    }

    /**
     * 所有静态方法进行监听
     * @param _before
     * @param _after
     * @param _isAsync
     * @return {boolean}
     */
    monitorStaticAll(_before, _after, _isAsync) {
        this.statics.forEach(value => {
            this._addBackFunction('s', value, this.clazz[value]);
            this.clazz[value] = this.clazz[value][getFunctionName(_isAsync)](value, _before, _after)
        });
        return true;
    }

    /**
     * 匹配所有的方法
     * @param _before
     * @param _after
     * @param _isAsync
     * @return {boolean}
     */
    monitorAll(_before, _after, _isAsync) {
        this.monitorStaticAll(_before, _after, _isAsync);
        this.monitorPrototypeAll(_before, _after, _isAsync);
        return true;
    }

    _addBackFunction(v, k, f) {
        this.back[v][k] = f;
    }

    /**
     * 还原添加监听器之前的function
     */
    restoreBack() {
        for (const k in this.back.p) {
            this.clazz.prototype[k] = this.back.p[k];
        }
        for (const k in this.back.s) {
            this.clazz[k] = this.back.s[k];
        }
        this._back = {p: {}, s: {}};
    }

    /**
     * 去除function的monitor
     */
    release() {
        Function.prototype.monitor = undefined;
        Function.prototype.monitorAsync = undefined;
    }


}

module.exports = Interceptor;
