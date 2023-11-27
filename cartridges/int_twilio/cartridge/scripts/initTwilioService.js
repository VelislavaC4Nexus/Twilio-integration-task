'use strict'

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var StringUtils = require('dw/util/StringUtils');
var Resource = require('dw/web/Resource');
var utils = require('./utils/utils');

function sendSMSFromTwilio(phone, productName) {

    var getTwilioService = LocalServiceRegistry.createService("http.twilio.service", {
        createRequest: function (svc, params) {
            var serviceConfig = svc.getConfiguration();

            svc.setRequestMethod('POST');
            svc.setURL(`${svc.configuration.credential.URL}`);
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');

            var username = svc.configuration.credential.user;
            var password = svc.configuration.credential.password;
            svc.addHeader('authorization', 'Basic ' + StringUtils.encodeBase64(username + ':' + password));
            return params;
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg
        }
    });

    var message = StringUtils.format(Resource.msg('message.twilio.sms', 'twilio', null), productName)
    var req = 'To=' + phone + '&From=' + utils.twilioPhoneNumber + '&Body=' + message;
    var response = getTwilioService.call(req);

    return response.object;
}

module.exports = {
    sendSMSFromTwilio: sendSMSFromTwilio,
};