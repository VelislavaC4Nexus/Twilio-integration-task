'use strict';

/**
 * @namespace Twilio
 */

var server = require('server');

var coHelpers = require('*/cartridge/scripts/helpers/coHelpers');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');


/**
* Twilio-Show : This endpoint is called to show form if product is out of stock
* @name Base/Twilio-Show
* @function
* @memberof Twilio
* @param {httpparameter} - csrf_token - a CSRF token
* @param {middleware} - consentTracking.consent
* @param {middleware} - server.middleware.https
* @param {serverfunction} - get
* 
*/
server.get('Show',
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var ProductMgr = require("dw/catalog/ProductMgr");
        var ContentMgr = require('dw/content/ContentMgr');
        var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');

        var productId = req.querystring.pid;
        var product = ProductMgr.getProduct(productId);

        var accountModel = accountHelpers.getAccountModel(req);
        var phoneNumber = accountModel ? accountModel.profile.phone : "";

        var outOfStockForm = server.forms.getForm('outOfStockForm');

        res.render("product/components/outOfStockForm", {
            product: product,
            phoneNumber: phoneNumber,
            outOfStockForm: outOfStockForm,
        });

        next();
    });

/**
* Twilio-Show : This endpoint is called to save data from out of stock form
* @name Base/Twilio-SavePhoneNumber
* @function
* @memberof Twilio
* @param {middleware} - csrfProtection.validateAjaxRequest
* @param {middleware} - server.middleware.https
* @param {returns} - json
* @param {serverfunction} - post
* 
*/
server.post('SavePhoneNumber',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var outOfStockForm = server.forms.getForm('outOfStockForm');
        var Resource = require('dw/web/Resource');

        if (outOfStockForm.valid) {
            var productName = outOfStockForm.twilio.productName.htmlValue;
            var phoneNumber = outOfStockForm.twilio.phone.htmlValue;
            var productId = outOfStockForm.twilio.productId.htmlValue;

            var addToCOResponse = coHelpers.submitToCO(productId, phoneNumber, productName);

            if (addToCOResponse.existingPhoneNumber && addToCOResponse.success) {
                res.json({
                    success: true,
                    msg: Resource.msg('success.message.existingPhoneNumber', 'twilio', null)
                });
            } else if (!addToCOResponse.existingPhoneNumber && addToCOResponse.success) {
                res.json({
                    success: true,
                    msg: Resource.msg('success.message.addToCO', 'twilio', null)
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