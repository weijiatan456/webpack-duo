require("../assets/public.scss");
require("./index.scss");

import {sum} from '../utils/common';

var [x,y] = [5,6];
console.log('我是来自页面b的和' + sum(x,y));