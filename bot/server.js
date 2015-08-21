// JOMWEBOT 0.1A August 2015
// -------------------------

var request = require('request'),
	defer = require('deferred'),
	env = (!process.env.BOT_TOKEN) ? require('./env.js') : undefined;

var jwj_group_id = process.env.JWJ_ID || "-14943090";
var _bot = require('vow-telegram-bot'),
	bot = new _bot({
		token: process.env.BOT_TOKEN || null ,
		polling: {
			timeout: 3,
			limit: 100
		}
	});

// -------------------------

var req = {
	callback: function(defer) {
		return function(err, res, body) {
			console.log(body)
			if (err) {
				defer.reject(err)
			} else {
				// Since the response is not always JSON,
				// we need to have some checking in the resolved callbacks.
				try {
					var a = JSON.parse(body);
				} catch(err) {
					var a = body;
				}
				defer.resolve(a)
			}
		}
	},
	token: function() {
		var q = defer(), _this = this;
		request('http://mrjunior.my/jomweb/jwj', _this.callback(q));
		return q.promise;
	},
	user: function(username) {
		var q = defer(), _this = this,
			options = { url: 'http://mrjunior.my/jomweb/api/members/'+username }
		this.token().done(function(res) {
			options.headers = { Authorization: 'Bearer '+ res.token };
			request(options, _this.callback(q));
		}, function(err) {
			console.log('user error:', err)
		});
		return q.promise;
	}
};

// -------------------------

var botcommands = {
	siapa: function(data, txtarray) {
		var text = '';
		req.user(txtarray[1]).done(function(res) {
			if (res.status == 200) {
				var skills = (res.skills) ? res.skills.join(', ') : 'main mata je',
					position = (res.position) ? res.position : 'yang mencari kerja',
					company = (res.company) ? res.company : 'mana-mana yang kosong',
					location = (res.location) ? res.location : 'dalam telegram ni je.';

				text += res.name + ', seorang ' + position + ' di ' + company +', ';
				text += 'pandai ' + skills + ' dan sekarang tinggal di ' + location;
			} else {
				text = 'Tak jumpa la sapa tu.'
			}
			bot.sendMessage({
				chat_id: data.chat.id,
				text: text
			})
		}, function(err) {
			console.log('async error: ', err)
		})
	},
	solat: function(data) {
		request('http://solatapi.herokuapp.com/api.php?place=jb', function(err, res, body) {
			var a = JSON.parse(body)
			bot.sendMessage({
				chat_id: data.chat.id,
				text: "Solat yang wajib ada 5. Subuh, Zohor, Asar, Isyak & Maghrib. Dah settle ke belum?"
			})
		})
	}
};

// -------------------------

bot.on('message', function(data) {
	console.log(data)
	if (data.text.charAt(0) === '/') {
		var a = data.text.split(' ');
		try {
			botcommands[a[0].slice(1)](data, a);
		} catch(error) {
			// Command is not supported
		}
	}
});



