'use strict';

/**
 * @namespace Twilio
 */

var server = require('server');

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
        var outOfStockForm = server.forms.getForm('outOfStockForm');
        var Resource = require('dw/web/Resource');

        if (outOfStockForm.valid) {
            var productName = outOfStockForm.twilio.productName.htmlValue;
            var phoneNumber = outOfStockForm.twilio.phone.htmlValue;
            var productId = outOfStockForm.twilio.productId.htmlValue;

            var addToCOResponse = addToCOHelper.addToCOHelper(productId, phoneNumber, productName);

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

server.get('Show', server.middleware.https, function (req, res, next) {
    var ProductMgr = require("dw/catalog/ProductMgr");
    var ContentMgr = require('dw/content/ContentMgr');
    var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');

    var productId = req.querystring.pid;
    var product = ProductMgr.getProduct(productId);

    var accountModel = accountHelpers.getAccountModel(req);
    var phoneNumber = accountModel ? accountModel.profile.phone : "";

    var outOfStockMessage = ContentMgr.getContent('outOfStockMessage');
    var outOfStockForm = server.forms.getForm('outOfStockForm');

    res.render("product/components/outOfStockForm", {
        product: product,
        phoneNumber: phoneNumber,
        outOfStockForm: outOfStockForm,
        outOfStockMessage: outOfStockMessage

    })

    next();
});


module.exports = server.exports();