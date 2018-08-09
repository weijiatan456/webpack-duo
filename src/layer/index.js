import '../utils/theme/default/layer.css';

require("./layerFun");
import {getHome} from '../utils/getData'

$('.aaa').green();

console.log($.sum(99,88));

getHome().then((res) => {
	alert(res.message);
})


// 异步加载模块，生成的文件以chunk.js结尾
require.ensure([], function(require){
    const bbb = require('../utils/ensure');
    console.log(bbb.common);
});