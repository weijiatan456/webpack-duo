import {age,sum} from '../utils/common';
import './index.scss';

var [x,y] = [5,6];
console.log('我是来自页面a的和' + sum(x,y));

console.log('我是来自页面a的年龄' + age);