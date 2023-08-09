const dropdownCurrencyFrom = document.getElementById('dropdown-currency_from');
const dropdownCurrencyTo = document.getElementById('dropdown-currency_to');

const loadingIndicator = document.getElementById('loading-indicator');
const exchangeTable = document.querySelector('.exchange-table');

var selectedCurrencyTo = '';
var selectedCurrencyFrom = '';

fetchData('MYR', 'USD');

dropdownCurrencyFrom.addEventListener("change", () => {
    selectedCurrencyFrom = dropdownCurrencyFrom.value;
    fetchData(selectedCurrencyFrom, selectedCurrencyTo);
    
});

dropdownCurrencyTo.addEventListener("change", () => {
    selectedCurrencyTo = dropdownCurrencyTo.value;
    fetchData(selectedCurrencyFrom, selectedCurrencyTo);
});

async function fetchData(selectedCurrencyFrom, selectedCurrencyTo) {
    if(selectedCurrencyFrom != '' && selectedCurrencyTo != ''){
        loadingIndicator.style.display = 'block';
        exchangeTable.style.display = 'none';

        try {
            const response = await fetch("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency="+selectedCurrencyFrom+"&to_currency="+selectedCurrencyTo+"&apikey=VM27KH7WXXV9ELRZ");
            const data = await response.json();
            const exchangeRateInfo = data["Realtime Currency Exchange Rate"];

            const fromCurrencyCode = exchangeRateInfo["1. From_Currency Code"];
            const fromCurrencyName = exchangeRateInfo["2. From_Currency Name"];
            const toCurrencyCode = exchangeRateInfo["3. To_Currency Code"];
            const toCurrencyName = exchangeRateInfo["4. To_Currency Name"];
            const exchangeRate = exchangeRateInfo["5. Exchange Rate"];
            const lastRefreshed = exchangeRateInfo["6. Last Refreshed"];
            const timeZone = exchangeRateInfo["7. Time Zone"];

            var fromCurrency = fromCurrencyCode+' - '+fromCurrencyName;
            var toCurrency = toCurrencyCode+' - '+toCurrencyName;
            var refreshTime = lastRefreshed+' ('+timeZone+')';

            document.getElementById("from_currency").innerHTML = fromCurrency;
            document.getElementById("to_currency").innerHTML = toCurrency;
            document.getElementById("exchange_rate").innerHTML = exchangeRate;
            document.getElementById("refresh_time").innerHTML = refreshTime;

            loadingIndicator.style.display = 'none';
            exchangeTable.style.display = 'table';
        } catch (error) {

            loadingIndicator.style.display = 'none';
            exchangeTable.style.display = 'none';
            
        }
        
    }
    else{
        document.getElementById("from_currency").innerHTML = '-';
        document.getElementById("to_currency").innerHTML = '-';
        document.getElementById("exchange_rate").innerHTML = '-';
        document.getElementById("refresh_time").innerHTML = '';
    }
}