const loadingIndicator = document.getElementById('loading-indicator');
const swapButton = document.getElementById('swap-btn');
const numberCurrencyFrom = document.getElementById('number-currency_from');
const numberCurrencyTo = document.getElementById('number-currency_to');
const exchangeTable = document.querySelector('.exchange-table');
const exchangeCurrency = document.querySelector('.exchange-currency');

var selectedCurrencyFrom = '';
var selectedCurrencyTo = '';
var exchangeRateFromTo = 1.00;
var exchangeRateToFrom = 1.00;

$(function () {
    $('.select2').select2();

    selectedCurrencyFrom = 'MYR';
    selectedCurrencyTo = 'USD';

    $('#dropdown-currency_from').val(selectedCurrencyFrom).trigger('change.select2');
    $('#dropdown-currency_to').val(selectedCurrencyTo).trigger('change.select2');

    fetchData(selectedCurrencyFrom, selectedCurrencyTo);
});

swapButton.addEventListener("click", () => {
    $('#dropdown-currency_from').val(selectedCurrencyTo).trigger('change.select2');
    $('#dropdown-currency_to').val(selectedCurrencyFrom).trigger('change.select2');

    selectedCurrencyFrom = $('#dropdown-currency_from').val();
    selectedCurrencyTo = $('#dropdown-currency_to').val();
    
    var currencyFrom = $('#number-currency_from').val();
    
    var totalExchange = currencyFrom * exchangeRateToFrom;
    numberCurrencyTo.value = totalExchange.toFixed(2);

    fetchData(selectedCurrencyFrom, selectedCurrencyTo);
});

numberCurrencyFrom.addEventListener("input", () => {
    var currencyFrom = $('#number-currency_from').val();

    var totalExchange = currencyFrom * exchangeRateFromTo;

    numberCurrencyTo.value = totalExchange.toFixed(2);
});

numberCurrencyTo.addEventListener("input", () => {
    var currencyTo = $('#number-currency_to').val();

    if(currencyTo != null){
        var totalExchange = currencyTo * exchangeRateToFrom;
    
        numberCurrencyFrom.value = totalExchange.toFixed(2);
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
        loadingIndicator.style.display = 'block';
        exchangeTable.style.display = 'none';
        exchangeCurrency.style.display = 'none';

        try {
            const responseFromTo = await fetch("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency="+selectedCurrencyFrom+"&to_currency="+selectedCurrencyTo+"&apikey=T7RYI7VN24ZE7VA1");
            const responseToFrom = await fetch("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency="+selectedCurrencyTo+"&to_currency="+selectedCurrencyFrom+"&apikey=T7RYI7VN24ZE7VA1");
            
            const dataFromTo = await responseFromTo.json();
            const dataToFrom = await responseToFrom.json();

            if(dataFromTo['Information'] || dataToFrom['Information']){
                alert(dataFromTo['Information']);
                return;
            }

            const exchangeRateFromToInfo = dataFromTo["Realtime Currency Exchange Rate"];
            const exchangeRateToFromInfo = dataToFrom["Realtime Currency Exchange Rate"];
            
            const fromCurrencyCode = exchangeRateFromToInfo["1. From_Currency Code"];
            const fromCurrencyName = exchangeRateFromToInfo["2. From_Currency Name"];
            const toCurrencyCode = exchangeRateFromToInfo["3. To_Currency Code"];
            const toCurrencyName = exchangeRateFromToInfo["4. To_Currency Name"];
            const lastRefreshed = exchangeRateFromToInfo["6. Last Refreshed"];
            const timeZone = exchangeRateFromToInfo["7. Time Zone"];
            
            exchangeRateFromTo = exchangeRateFromToInfo["5. Exchange Rate"];
            exchangeRateToFrom = exchangeRateToFromInfo["5. Exchange Rate"];

            var fromCurrency = fromCurrencyCode+' - '+fromCurrencyName;
            var toCurrency = toCurrencyCode+' - '+toCurrencyName;
            var refreshTime = lastRefreshed+' ('+timeZone+')';

            document.getElementById("from_currency").innerHTML = fromCurrency;
            document.getElementById("from_exchange_currency").innerHTML = fromCurrency;
            document.getElementById("to_currency").innerHTML = toCurrency;
            document.getElementById("to_exchange_currency").innerHTML = toCurrency;
            document.getElementById("exchange_rate").innerHTML = exchangeRateFromTo;
            document.getElementById("refresh_time").innerHTML = refreshTime;

            loadingIndicator.style.display = 'none';
            exchangeTable.style.display = 'table';
            exchangeCurrency.style.display = 'table';
        } catch (error) {
            loadingIndicator.style.display = 'none';
            exchangeTable.style.display = 'none';
            exchangeCurrency.style.display = 'none';
        }

        numberCurrencyFrom.removeAttribute('disabled');
        numberCurrencyTo.removeAttribute('disabled');
        
    }
    else{
        document.getElementById("from_currency").innerHTML = '-';
        document.getElementById("from_exchange_currency").innerHTML = '-';
        document.getElementById("to_currency").innerHTML = '-';
        document.getElementById("to_exchange_currency").innerHTML = '-';
        document.getElementById("exchange_rate").innerHTML = '-';
        document.getElementById("refresh_time").innerHTML = '';
        
        numberCurrencyFrom.value = 0.00;
        numberCurrencyFrom.setAttribute('disabled', true);
        numberCurrencyTo.value = 0.00;
        numberCurrencyTo.setAttribute('disabled', true);
    }
}