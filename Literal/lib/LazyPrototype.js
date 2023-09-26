/**
 * 所有 Literal 库下写的字面量类继承的原型。
 * 约定所有字面量类都以一个名为instance的成员承载闭包函数用于延迟求值。
 * @class
 * @method __evaluate__ 用于对字面量类进行求值。该方法是不可逆的、且只能执行一次。
 * @method __isEvaluated__ 基本上不会用到的、用于判断该类是否完成求值。
 * @member __literalmapcls__ 指明该类为字面量类。
 */
export class LazyPrototype extends Object{
    constructor(){
        super()
    }

    __literalmapcls__ = true

    __evaluate__(bind = undefined){
        console.log(this)
        this.instance = this.instance.apply()
        bind === undefined?null:bind = this.instance
        return this.instance
    }

    __isEvaluated__(){
        return !LazyPrototype.prototype.isPrototypeOf(this.instance)
    }
}