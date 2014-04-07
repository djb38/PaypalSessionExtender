// ==UserScript==
// @name          Paypal Session Extender
//
// @description   Sends keepalive signals to Paypal to maintain session
//
// @grant         GM_getValue
// @grant         GM_setValue
//
// @exclude       *.paypal.com*
//
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
//
// ==/UserScript==

var PaypalSessionExtender = {
	settings: {
		heartbeat: 5000, // 5 second interval between checks to see if a new signal needs to be sent to Paypal
		interval: 300000, // 5 minute interval between poking Paypal to stay logged in
		iFrameSrc: 'https://paypalmanager.paypal.com/login.do'
	},
	cache: {
		getLastKeepalive: function() {
			return +GM_getValue('paypal_keepalive', 0);
		},
		setLastKeepalive: function() {
			return GM_setValue('paypal_keepalive', $.now());
		},
		iFrame: null,
	},
	initialise: function() {
		setInterval(PaypalSessionExtender.check, PaypalSessionExtender.settings.heartbeat);
	},
	check: function() {
		if ($.now() - PaypalSessionExtender.cache.getLastKeepalive() > PaypalSessionExtender.settings.interval) {
			PaypalSessionExtender.keepAlive();
		}
	},
	keepAlive: function() {
		PaypalSessionExtender.cache.setLastKeepalive();

		if (PaypalSessionExtender.cache.iFrame) {
			PaypalSessionExtender.cache.iFrame.remove();
			PaypalSessionExtender.cache.iFrame = null;
		}

		PaypalSessionExtender.cache.iFrame = $('<iframe src="' + PaypalSessionExtender.settings.iFrameSrc + '?t=' + $.now() + '" style="display: none;"></iframe>');
		$('body').append(PaypalSessionExtender.cache.iFrame);
	}
};

PaypalSessionExtender.initialise();