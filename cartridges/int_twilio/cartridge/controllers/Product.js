'use strict';

/**
 * @namespace Product
 */

var server = require('server');
server.extend(module.superModule);

/**
 * @typedef ProductDetailPageResourceMap
 * @type Object
 * @property {String} global_availability - Localized string for "Availability"
 * @property {String} label_instock - Localized string for "In Stock"
 * @property {String} global_availability - Localized string for "This item is currently not
 *     available"
 * @property {String} info_selectforstock - Localized string for "Select Styles for Availability"
 */

/**
* Product-Show : This endpoint is called to show the details of the selected product
* @name Base/Product-Show
* @function
* @memberof Product
* @param {middleware} - cache.applyPromotionSensitiveCache
* @param {middleware} - consentTracking.consent
* @param {querystringparameter} - pid - Product ID
* @param {category} - non-sensitive
* @param {renders} - isml
* @param {serverfunction} - get
*/
server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();

    var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');
    var accountModel = accountHelpers.getAccountModel(req);
    viewData.phoneNumber = accountModel? accountModel.profile.phone : "";

    var outOfStockForm = server.forms.getForm('outOfStockForm');
    viewData.outOfStockForm = outOfStockForm;

    var ContentMgr = require('dw/content/ContentMgr');
    var outOfStockMessage = ContentMgr.getContent('outOfStockMessage');
    if(outOfStockMessage){
        viewData.outOfStockMessage = outOfStockMessage;
    }
    res.setViewData(viewData);
    next();
});


module.exports = server.exports();
