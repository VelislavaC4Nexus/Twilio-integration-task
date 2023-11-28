var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');
var utils = require('../utils/utils');

module.exports.execute = function () {
    var allCOTwilio = CustomObjectMgr.getAllCustomObjects(utils.typeTwilioCO);
    var initTwilioService = require('*/cartridge/scripts/initTwilioService');
    var Site = require('dw/system/Site');
    var twilioPhoneNumber = Site.current.getCustomPreferenceValue('v_site_pref_twilio_phone');

    try {
        while (allCOTwilio.hasNext()) {
            var error = false;
            var co = allCOTwilio.next();
            var productId = co.custom.productId;
            var phones = co.custom.phoneNumber;
            var currentProduct = ProductMgr.getProduct(productId);
            var isProductAvailable = currentProduct.availabilityModel.availability > 0;
            if (phones && currentProduct.availabilityModel.availability > 0) {
                phones.forEach(phone => {
                    var response = initTwilioService.sendSMSFromTwilio(phone, currentProduct.name,twilioPhoneNumber);
                    if (response.statusMessage !== "Created") {
                        error = true;
                    } else {
                        var sth = co.custom.phoneNumber;
                        var newPhonesArr = Array.from(co.custom.phoneNumber).filter(p => p !== phone);
                         if (newPhonesArr.length !== 0) {
                            Transaction.wrap(function () {
                                co.custom.phoneNumber = newPhonesArr;
                            });
                        }else{
                            Transaction.wrap(function () {
                                CustomObjectMgr.remove(co);
                            });
                        }
                    }
                });
           
            }

        }

    } catch (error) {
        var Logger = require('dw/system/Logger');
        var Resource = require('dw/web/Resource');
        Logger.error(Resource.msg('error.twilio.job', 'twilio', null));
    }
}