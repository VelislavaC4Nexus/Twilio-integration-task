'use strict';

module.exports = {
    updateAttribute: function () {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            console.log("updateAttribute CUSTOM");
            console.log(response);
            console.log(response.data);
            if (response.data.product.available) {
                console.log("AVAILABLE");
                if ($('#add-to-cart-btn').hasClass('d-none')) {
                    $('#add-to-cart-btn').removeClass('d-none');
                }
                $('#out-of-stock-subscription').addClass('d-none');
            }else{
                console.log("NOT AV");
                if ($('#out-of-stock-subscription').hasClass('d-none')) {
                    $('#out-of-stock-subscription').removeClass('d-none');
                }
                $('#add-to-cart-btn').addClass('d-none');
                
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
    }
}