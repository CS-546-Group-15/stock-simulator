// // shell for ajax form -- TODO

(function ($) {
    // initializes all popovers on the website
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        const popoverId = popoverTriggerEl.attributes['data-content-id'];
        const contentEl = $(`#${popoverId.value}`).html();
        return new bootstrap.Popover(popoverTriggerEl, {
            html: true,
            content: contentEl
        });
    });
})(window.jQuery);