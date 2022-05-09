// // shell for ajax form -- TODO

(function ($) {
    // initializes all popovers on the website
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        const popoverId = popoverTriggerEl.attributes['data-content-id'];
        const contentEl = $(`#${popoverId.value}`).html();
        bootstrap.Tooltip.Default.allowList.table = [];
        bootstrap.Tooltip.Default.allowList.tr = [];
        bootstrap.Tooltip.Default.allowList.th = [];
        bootstrap.Tooltip.Default.allowList.td = [];
        bootstrap.Tooltip.Default.allowList.div = [];
        bootstrap.Tooltip.Default.allowList.tbody = [];
        bootstrap.Tooltip.Default.allowList.thead = [];
        return new bootstrap.Popover(popoverTriggerEl, {
            html: true,
            container: 'body',
            content: contentEl
        });
    });

    // error checking for stock symbol
    function checkSymbol(symbol) {
        if (!symbol) throw "Must provide a symbol";
        if (typeof symbol !== 'string') throw "Symbol must be of type string";
        if (symbol.trim().length < 1) throw "Symbol must be nonempty";
        if (symbol.trim().length > 5) throw "Symbol invalid, must be 5 or fewer characters long";
        symbol = symbol.toLowerCase();
        symbol = symbol.trim();
    
        //make sure symbol has no spaces and only letters
        for (let i = 0; i < symbol.length; i++) {
            let code = symbol.charCodeAt(i);
            if (symbol.charAt(i) === ' ') throw "Symbol cannot contain spaces";
            if (!(code > 96 && code < 123)) throw "Symbol must only contain letters";
        }    
    }

    // Ajax request for stock quote
    var stockTable = $('#stocks');
    var modalSymbol = $('#stock-symbol');
    var modalBody = $('#stock-info');

    // ajax for quote request
    var quoteForm = $('#searchQuote');
    var quoteSymbol = $('#quote');

    stockTable.on('click', 'a', function (event) {
        event.preventDefault();
        var currentSymbol = event.target.innerText; // get the symbol of the stock
        checkSymbol(currentSymbol);
        // empty the modal
        modalSymbol.empty();
        modalBody.empty();

        // setup api call with current symbol
        requestConfig = {
            method: 'GET',
            url: `https://cloud.iexapis.com/stable/stock/${currentSymbol}/quote?token=pk_f1ab256ea4ad4fe288c7066938835519` // IEX Cloud API call for a stock quote
        }

        $.ajax(requestConfig).then(function (responseMessage) { // API call returning quote data
            // populate modal with stock info
            modalSymbol.append(`${currentSymbol}`);
            modalBody.append(`<p>Latest Price: \$${responseMessage.latestPrice}</p>`);
            modalBody.append(`<p>Open: \$${responseMessage.open}</p>`);
            modalBody.append(`<p>High: \$${responseMessage.high}</p>`);
            modalBody.append(`<p>Low: \$${responseMessage.low}</p>`);
            modalBody.append(`<p>Previous Close: \$${responseMessage.previousClose}</p>`);
            modalBody.append(`<p>Volume: ${responseMessage.volume}</p>`);
            modalBody.append(`<p>52-Week High: \$${responseMessage.week52High}</p>`);
            modalBody.append(`<p>52-Week Low: \$${responseMessage.week52Low}</p>`);
        });
    });

    // ajax form for getting any stock quote
    quoteForm.submit(function (event) {
        console.log('submitting');
        event.preventDefault();
        // need to error check this
        var currentSymbol = quoteSymbol.val().trim();
        checkSymbol(currentSymbol);

        checkSymbol(currentSymbol);
        // empty the modal
        modalSymbol.empty();
        modalBody.empty();

        // setup api call with current symbol
        requestConfig = {
            method: 'GET',
            url: `https://cloud.iexapis.com/stable/stock/${currentSymbol}/quote?token=pk_f1ab256ea4ad4fe288c7066938835519` // IEX Cloud API call for a stock quote
        }

        $.ajax(requestConfig).then(function (responseMessage) { // API call returning quote data
            // populate modal with stock info
            modalSymbol.append(`${currentSymbol}`);
            modalBody.append(`<p>Latest Price: \$${responseMessage.latestPrice}</p>`);
            modalBody.append(`<p>Open: \$${responseMessage.open}</p>`);
            modalBody.append(`<p>High: \$${responseMessage.high}</p>`);
            modalBody.append(`<p>Low: \$${responseMessage.low}</p>`);
            modalBody.append(`<p>Previous Close: \$${responseMessage.previousClose}</p>`);
            modalBody.append(`<p>Volume: ${responseMessage.volume}</p>`);
            modalBody.append(`<p>52-Week High: \$${responseMessage.week52High}</p>`);
            modalBody.append(`<p>52-Week Low: \$${responseMessage.week52Low}</p>`);
        });
    })
})(window.jQuery);