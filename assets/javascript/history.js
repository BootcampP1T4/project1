//history.muffinlabs.com API call, send individual arguments for month & day
function getHistory(month, day) {
    let endpoint = "https://cors-anywhere.herokuapp.com/https://history.muffinlabs.com/date/";
    let queryURL = endpoint + month + "/" + day;
    return $.ajax({
        url: queryURL,
        method: "GET",
        //}).done(function (response) { //change .done to .then
    }).then(function (response) {
        response = JSON.parse(response);
        historyObj.date = response.date;
        historyObj.events = response.data.Events.reverse();
        historyObj.births = response.data.Births.reverse();
        historyObj.deaths = response.data.Deaths.reverse();
    }).fail(function (err) {
        throw err;
    });
};


//global object containing returned history API data
let historyObj = {
    date: "",
    events: [],
    births: [],
    deaths: []
};

//ready js
$(document).ready(function () {
    /*
    // post x most recent Firebase
    let ref = firebase.database().ref("history");
    ref.orderByChild("dateAdded").limitToLast(3).on("child_added", function (dbQuery) {
        console.log("share", dbQuery.val());
        $("#share").empty();
        $.each(dbQuery.history, function (index, value) {
            console.log(value);
            $(id).append(`
                <div id="history-${index}" class="sharedItem section">    
                    <button id="history-btn-${index}" class="history-btn" type="button">share</button>
                    ${value.year} - ${value.html}
                </div>
            `);
        });
    });
    */
   
}); //end ready js