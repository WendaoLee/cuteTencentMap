function Effect(f){
    return {
        map(g){
            return Effect(x => g(f(x)))
        }
    }
}

function test(){
    return 0
}

const ft = Effect(test)

console.log(ft)