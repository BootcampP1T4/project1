//muffin labs history api call, send individual arguments for month & day
function getHistory(month, day) {

    let endpoint = "https://cors-anywhere.herokuapp.com/https://history.muffinlabs.com/date/";
    let queryURL = endpoint + month + "/" + day;
    
        return $.ajax({
            url: queryURL,
            method: "GET",
        }).done(function (response) {
            response = JSON.parse(response);
            historyObj.date = response.date;
            historyObj.events = response.data.Events;
            historyObj.births = response.data.Births;
            historyObj.deaths = response.data.Deaths;
        }).fail(function () {
            throw err;
        })
    //return historyObj;
};

let historyObj = {
    date: "",
    events: [],
    births: [],
    deaths: []
};
/*
//ready js
$(document).ready(function () {

    // pass dynamically from front end
    let month = 8;
    let day = 9;
    
    //historyObj = getHistory(month, day);
    $.when(getHistory(month, day)).done(function () {
        console.log(historyObj);
    });
    //historyDataObj = JSON.parse(historyDataObj);
    
    //end ready js
});
*/