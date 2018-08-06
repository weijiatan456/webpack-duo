require("./layerFun");
import {getHome} from '../utils/getData'
import '../utils/theme/default/layer.css';

$('.aaa').green();

console.log($.sum(99,88));

getHome().then((res) => {
	alert(res.message);
})