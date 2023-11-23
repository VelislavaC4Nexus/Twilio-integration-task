'use strict';

/**
 * @namespace Twilio
 */

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var Transaction = require('dw/system/Transaction');
var addToCOHelper = require('*/cartridge/scripts/helpers/addToCOHelper')
// var utils = require('../scripts/utils/utils');

/**
* Product-Show : This endpoint is called to show the details of the selected product
* @name Base/Twilio-SavePhoneNumber
* @function
* @memberof Twilio
* @param {httpparameter} - csrf_token - a CSRF token
 @param {middleware} - server.middleware.https
* 
*/
server.post('SavePhoneNumber',
    server.middleware.https,
    function (req, res, next) {
        var formErrors = require('*/cartridge/scripts/formErrors');

        var outOfStockForm = server.forms.getForm('outOfStockForm');
        var Transaction = require('dw/system/Transaction');
        var Resource = require('dw/web/Resource');

        if (outOfStockForm.valid) {

            var phoneNumber = outOfStockForm.twilio.phone.htmlValue;
            var productId = outOfStockForm.twilio.productId.htmlValue;

            var addToCOResponse = addToCOHelper.addToCOHelper(productId, phoneNumber);

            if (addToCOResponse.existingPhoneNumber && addToCOResponse.success) {
                res.json({
                    success: true,
                    msg: Resource.msg('success.message.existingPhoneNumber', 'forms', null)
                });
            } else if (!addToCOResponse.existingPhoneNumber && addToCOResponse.success) {
                res.json({
                    success: true,
                    msg: Resource.msg('success.message.addToCO', 'forms', null)
                });
            } else if (!addToCOResponse.existingPhoneNumber && !addToCOResponse.success) {
                res.json({
                    success: false,
                    msg: Resource.msg('error.twilio.message.parse.phone', 'forms', null)
                });
            }

        } else {
            res.json({
                success: false,
                msg: Resource.msg('error.twilio.message.parse.phone', 'forms', null)
            });
        }
        next();
    });

module.exports = server.exports();