require("../assets/public.scss");
require("./index.scss");

import str from '../utils/common';

var fn = () => {
    return ('我是来自页面c的字符串:' + str)
};

document.querySelector('#insertTxt').innerHTML = fn();
