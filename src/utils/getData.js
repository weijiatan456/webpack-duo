import jsonp from './jsonp'

export function getHome(){
	const url = 'https://www.xiami.com/playercollect/list'
	const data = {_ksTS: '1532589662852_61'}
	const options = {param: 'callback'}
	return jsonp(url, data, options)
}