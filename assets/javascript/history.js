//history.muffinlabs.com api call, send individual arguments for month & day
function getHistory(month, day) {
    let endpoint = "https://cors-anywhere.herokuapp.com/https://history.muffinlabs.com/date/";
    let queryURL = endpoint + month + "/" + day;
    return $.ajax({
        url: queryURL,
        method: "GET",
    }).done(function (response) { //change .done to .then
        response = JSON.parse(response);
        historyObj.date = response.date;
        historyObj.events = response.data.Events;
        historyObj.births = response.data.Births;
        historyObj.deaths = response.data.Deaths;
    }).fail(function () {
        throw err;
    });
};

function validation(testName, testDate) {
    let currentDate = parseInt(moment().format("YYYYMMDD"));
    testDate = parseInt(moment(testDate, "YYYY-MM-DD").format("YYYYMMDD"));
    let testYear = parseInt(moment(testDate, "YYYY-MM-DD").format("YYYY"));
    let testMonth = parseInt(moment(testDate, "YYYY-MM-DD").format("M"));
    let testDay = parseInt(moment(testDate, "YYYY-MM-DD").format("D"));
    if (testName.len > 0
        && testDate <= currentDate
        && testYear >= 1940
        && testMonth >= 1
        && testMonth <= 12
        && testDay >= 1
        && testDay <= 31) {
            return true;
    }
    return false;
};

let historyObj = {
    date: "",
    events: [],
    births: [],
    deaths: []
};

$("#search").on("click", function (event) {
    event.preventDefault();
    let searchName = $("#name").val();
    let searchDate = $("#date").val();
    console.clear();
    console.log(searchName, searchDate);
    if (validation(searchName, searchDate) == true) {
        let searchMonth = parseInt(moment(searchDate, "YYYY-MM-DD").format("M"));
        let searchDay = parseInt(moment(searchDate, "YYYY-MM-DD").format("D"));
        console.log(searchDate, searchMonth, searchDay);
    } else {
        $("#name").attr("placeholder", "please enter a valid username");
        
    }
});

//ready js
$(document).ready(function () {
    // pass dynamically from front end
    let month = moment().format("M");
    let day = moment().format("D");
    console.log(month, day);
    $.when(getHistory(month, day)).done(function () { //change to .done to .then and remove .when
        console.log(historyObj);
    });

}); //end ready js
