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

	iFrame: null,

	getLastKeepalive: function() {
		return +GM_getValue('paypal_keepalive', 0);
	},

	setLastKeepalive: function() {
		return GM_setValue('paypal_keepalive', $.now());
	},

	initialise: function() {
		setInterval(function() {
			if ($.now() - PaypalSessionExtender.getLastKeepalive() > PaypalSessionExtender.settings.interval) {
				PaypalSessionExtender.keepAlive();
			}
		}, this.settings.heartbeat);
	},

	keepAlive: function() {
		this.setLastKeepalive();

		if (this.iFrame) {
			this.iFrame.remove();
			this.iFrame = null;
		}

		this.iFrame = $('<iframe src="' + this.settings.iFrameSrc + '?t=' + $.now() + '" style="display: none;"></iframe>');
		$('body').append(this.iFrame);
	}
};

PaypalSessionExtender.initialise();
