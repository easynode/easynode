
var express = require('express');
var app = express();
var querystring = require('querystring');
var request = require('request');

app.set('views','./');
app.set('view engine','jade');

app.get('/login', function(request, response,next) {
	var publicUrl = 'http://218.205.113.98:6005';
	var url = 'https://login.netease.com/openid/?';

	url += querystring.stringify({
		'openid.return_to': publicUrl + '/login/authenticate',
		'openid.realm': publicUrl,
		'openid.sreg.required': 'nickname,email,fullname',
		'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
		'openid.mode': 'checkid_setup',
		'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
		'openid.ns': 'http://specs.openid.net/auth/2.0',
		'openid.ns.sreg': 'http://openid.net/extensions/sreg/1.1',
		'openid.assoc_handle': '',
		'openid.ax.mode': 'fetch_request',
		'openid.ax.type.empno': 'https://login.netease.com/openid/empno/',
		'openid.ns.ax': 'http://openid.net/srv/ax/1.0',
		'openid.ax.required': 'empno,dep',
		'openid.ax.type.dep': 'https://login.netease.com/openid/dep/'
	});

	response.redirect(url);
});

app.get('/login/authenticate', function(req, res) {
	console.dir("1");
	var query = req.query;
	if (query['openid.mode'] != 'id_res' || query['openid.identity'].indexOf('https://login.netease.com/openid/') != 0) {
		res.end('授权出错');
		return;
	}

	query['openid.mode'] = 'check_authentication';

	var options = {
		method: 'POST',
		url: 'https://login.netease.com/openid/',
		form: query
	};
	request(options, function(err, hreq, body) {
		if (err) return next(err);
		var obj = querystring.parse(body, '\n', ':');
		if (obj.is_valid !== 'true') {
			res.end('授权出错');
			return;
		}
console.dir(obj);
console.log(query['openid.sreg.nickname']);
console.dir(query);
		//req.session.userToken = {
		//	username: query['openid.sreg.nickname'],
		//	authorized_time: Date.now()
		//};

		res.redirect('/');
	});
});


app.listen(6005);
