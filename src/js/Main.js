import get from 'get';

get('/static/test.txt').then(res=> {
	console.log(res);
});
