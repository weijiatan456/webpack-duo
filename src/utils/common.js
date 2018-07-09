// 供a页面调用
export const age = '30';

// 供a、b页面调用
export function sum(a,b){
    return a + b;
}

// 仅供c页面调用
const str = 'hello world';
export default str;