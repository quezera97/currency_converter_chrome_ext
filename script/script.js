$(document).ready(function() {
    const loadingIndicator = $('#loading-indicator');
    const numberCurrencyFrom = $('#number-currency_from');
    const numberCurrencyTo = $('#number-currency_to');
    const exchangeTable = $('.exchange-table');
    const exchangeCurrency = $('.exchange-currency');

    let selectedCurrencyFrom = '';
    let selectedCurrencyTo = '';
    let exchangeRateFromTo = 1.00;
    let exchangeRateToFrom = 1.00;

    $('.select2').select2();
    $('#failed-currency').hide();

    selectedCurrencyFrom = 'MYR';
    selectedCurrencyTo = 'USD';

    $('#dropdown-currency_from').val(selectedCurrencyFrom).trigger('change.select2');
    $('#dropdown-currency_to').val(selectedCurrencyTo).trigger('change.select2');

    fetchData(selectedCurrencyFrom, selectedCurrencyTo);

    $('#swap-btn').on("click", function() {
        $('#dropdown-currency_from').val(selectedCurrencyTo).trigger('change.select2');
        $('#dropdown-currency_to').val(selectedCurrencyFrom).trigger('change.select2');

        selectedCurrencyFrom = $('#dropdown-currency_from').val();
        selectedCurrencyTo = $('#dropdown-currency_to').val();
        
        const currencyFrom = $('#number-currency_from').val();
        
        const totalExchange = currencyFrom * exchangeRateToFrom;
        numberCurrencyTo.val(totalExchange.toFixed(2));

        fetchData(selectedCurrencyFrom, selectedCurrencyTo);
    });

    $('#number-currency_from').on("input", function() {
        const currencyFrom = $('#number-currency_from').val();

        const totalExchange = currencyFrom * exchangeRateFromTo;

        numberCurrencyTo.val(totalExchange.toFixed(2));
    });

    $('#number-currency_to').on("input", function() {
        const currencyTo = $('#number-currency_to').val();

        if(currencyTo != null){
            const totalExchange = currencyTo * exchangeRateToFrom;
        
            numberCurrencyFrom.val(totalExchange.toFixed(2));
        }
    });

    $('#dropdown-currency_from').on('change', function() {
        selectedCurrencyFrom = $('#dropdown-currency_from').val();
        fetchData(selectedCurrencyFrom, selectedCurrencyTo);
    });

    $('#dropdown-currency_to').on('change', function() {
        selectedCurrencyTo = $('#dropdown-currency_to').val();
        fetchData(selectedCurrencyFrom, selectedCurrencyTo);
    });

    async function fetchData(selectedCurrencyFrom, selectedCurrencyTo) {
        if(selectedCurrencyFrom != '' && selectedCurrencyTo != ''){
            loadingIndicator.css('display', 'block');
            exchangeTable.css('display', 'none');
            exchangeCurrency.css('display', 'none');

            try {
                selectedCurrencyFrom = selectedCurrencyFrom.toLowerCase();
                selectedCurrencyTo = selectedCurrencyTo.toLowerCase();
                const responseCurrency = await fetch(`https://www.floatrates.com/daily/${selectedCurrencyFrom}.json`);
                let dataCurrency = await responseCurrency.json();
                dataCurrency = dataCurrency[selectedCurrencyTo];

                const fromCurrencyCode = selectedCurrencyFrom;
                const toCurrencyCode = dataCurrency['code'];
                const lastRefreshed = dataCurrency['date'];
                
                exchangeRateFromTo = dataCurrency['rate'];
                exchangeRateToFrom = dataCurrency['inverseRate'];

                const fromCurrency = fromCurrencyCode.toUpperCase();
                const toCurrency = toCurrencyCode.toUpperCase();
                const refreshTime = lastRefreshed;

                $('#from_currency').text(fromCurrency);
                $('#from_exchange_currency').text(fromCurrency);
                $('#to_currency').text(toCurrency);
                $('#to_exchange_currency').text(toCurrency);
                $('#exchange_rate').text(exchangeRateFromTo);
                $('#refresh_time').text(refreshTime);

                loadingIndicator.css('display', 'none');
                exchangeTable.css('display', 'table');
                exchangeCurrency.css('display', 'table');
            } catch (error) {
                loadingIndicator.css('display', 'none');
                exchangeTable.css('display', 'none');
                exchangeCurrency.css('display', 'none');

                $('#failed-currency').show();
            }

            numberCurrencyFrom.removeAttr('disabled');
            numberCurrencyTo.removeAttr('disabled');
        } else {
            $('#from_currency, #from_exchange_currency, #to_currency, #to_exchange_currency, #exchange_rate').text('-');
            $('#refresh_time').text('');
            
            numberCurrencyFrom.val('0.00').attr('disabled', true);
            numberCurrencyTo.val('0.00').attr('disabled', true);
        }
    }
});
