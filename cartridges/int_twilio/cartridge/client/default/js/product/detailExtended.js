'use strict';

var createErrorNotification = require('base/components/errorNotification');
var utils = require('../utils');

function displayMessage(data, status) {
    $.spinner().stop();
    var status;
    if (data.success) {
        status = 'alert-success';
    } else {
        status = 'alert-danger';
    }

    if ($('.add-to-cart-messages').length === 0) {
        $('body').append(
            '<div class="add-to-cart-messages"></div>'
        );
    }
    $('.add-to-cart-messages')
        .append('<div class="add-to-basket-alert alert ' + status + '" role="alert">' + data.msg + '</div>');

    setTimeout(function () {
        $('.add-to-basket-alert').remove();
    }, 5000);
}

module.exports = {
    updateAttribute: function () {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            if (response.data.product.available) {
                if ($(utils.selectorAddToCartBtn).hasClass('d-none')) {
                    $(utils.selectorAddToCartBtn).removeClass('d-none');
                }
                $(utils.selectorOutOfStockSubscription).addClass('d-none');
            } else {
                if ($(utils.selectorOutOfStockSubscription).hasClass('d-none')) {
                    $(utils.selectorOutOfStockSubscription).removeClass('d-none');
                }
                $(utils.selectorAddToCartBtn).addClass('d-none');
                $('.js-productId').val(response.data.product.id);
            }
            if ($('.product-detail>.bundle-items').length) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else if ($('.product-set-detail').eq(0)) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else {
                $('.product-id').text(response.data.product.id);
                $('.product-detail:not(".bundle-item")').data('pid', response.data.product.id);
            }
        });
    },

    notifyMeOutOfStock: function () {
        $('form.out-of-stock-subscribe').submit(function (e) {
            var form = $(this);
            e.preventDefault();
            var url = form.attr('action');
            form.spinner().start();
            $('form.out-of-stock-subscribe').trigger('notifyMeOutOfStock:submit', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: form.serialize(),
                success: function (data) {
                    if (data.success) {
                        $('#out-of-stock-subscribe-phone').prop('disabled', true);
                        $('#out-of-stock-subscription-btn').prop('disabled', true);
                    }
                    displayMessage(data)
                    form.spinner().stop();
                },
                error: function (err) {
                    createErrorNotification($('.error-messaging'), err.responseJSON.errorMessage);
                    form.spinner().stop();
                }
            });
            return false;
        });
    }
}