
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var utils = require('../utils/utils');


function submitToCO(productId, phoneNumber, productName) {
    var type = utils.typeTwilioCO
    var keyValue = productId;
    var twilioCO = CustomObjectMgr.getCustomObject(type, keyValue);
    var response = {
        success: false,
        existingPhoneNumber: false,
    };

    try {
        Transaction.wrap(function () {
            if (!twilioCO) {
                twilioCO = CustomObjectMgr.createCustomObject(type, keyValue);
                twilioCO.custom.phoneNumber = [phoneNumber];
                twilioCO.custom.productName = productName;
            } else {
                var phones = Array.from(twilioCO.custom.phoneNumber);
                var phoneIsExisting = phones.includes(phoneNumber);
                if (!phoneIsExisting) {
                    phones.push(phoneNumber)
                    twilioCO.custom.phoneNumber = phones;
                } else {
                    response.existingPhoneNumber = true;
                }
            }
            response.success = true;
        });
    } catch (e) {
        response.success=false;
    }
    return response;
}

module.exports = {
    submitToCO: submitToCO
}