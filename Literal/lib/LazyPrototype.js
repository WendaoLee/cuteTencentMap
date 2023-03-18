
export class LazyPrototype{
    constructor(){

    }

    _evaluate(){
        this.instance = this.instance.apply()
    }
}