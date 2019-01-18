// Initialize Firebase
var config = {
    apiKey: "AIzaSyATqeh-hyDxXHeiGMmrcOZI-yK-NAsJBeM",
    authDomain: "bootcampp1t4.firebaseapp.com",
    databaseURL: "https://bootcampp1t4.firebaseio.com",
    projectId: "bootcampp1t4",
    storageBucket: "bootcampp1t4.appspot.com",
    messagingSenderId: "250848158957"
};

firebase.initializeApp(config);
let db = firebase.database();

//validation of username and date from front end gui
function validation(testName, testDate) {
    let regex = /^[A-Za-z0-9_]+$/;
    if (regex.test(testName) &&
        testName.len > 0 &&
        testName.len <= 12) {
        // do nothing
    } else {
        testName = false;
    }
    let currentDate = parseInt(moment().format("YYYYMMDD"));
    testDate = parseInt(moment(testDate, "YYYY-MM-DD").format("YYYYMMDD"));
    let testYear = parseInt(moment(testDate, "YYYY-MM-DD").format("YYYY"));
    let testMonth = parseInt(moment(testDate, "YYYY-MM-DD").format("M"));
    let testDay = parseInt(moment(testDate, "YYYY-MM-DD").format("D"));
    if (testDate <= currentDate &&
        testYear >= 1930 &&
        testMonth >= 1 &&
        testMonth <= 12 &&
        testDay >= 1 &&
        testDay <= 31) {
        // do nothing
    } else {
        testDate = false;
    }
    return [testName, testDate];
};

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

// add to html to force all links to open in new tab
// <base target="_blank">
//post API response to DOM
function postHistory(id) {
    if (id == "#history") {
        $.each(historyObj.events, function (index, value) {
            //console.log(value);
            $(id).append(`
                <div id="history-${index}" class="sharedItem section">    
                    <button id="history-btn-${index}" class="history-btn" type="button">share</button>
                    ${value.year} - ${value.html}
                </div>
            `);
        });
    } else if (id == "nyt") {
        // Aaron's code
    }
}

function shareHistory(index) {
    db.ref("history").push({
        api: "history",
        dateAdded: moment().valueOf(), // .unix(),
        dateSearched: moment(dateSearched, "YYYY-MM-DD").format("YYYYMMDD"),
        userName: userName,
        userShared: historyObj.events[index].html
    });
}

//global object containing returned history API data
let historyObj = {
    date: "",
    events: [],
    births: [],
    deaths: []
};

// default to [blank] and current date
let userName = "[blank]";
let dateSearched = moment().format("YYYY-MM-DD");
let snapshotFirebase = {};

let i = 0;

//ready js
$(document).ready(function () {
    // post x most recent Firebase
    let ref = firebase.database().ref("history");
    ref.orderByChild("dateAdded").limitToLast(3).on("child_added", function (dbQuery) {
        console.log("share", dbQuery.val());
        $("#share").empty();
        /*
        $.each(dbQuery.history, function (index, value) {
            console.log(value);
            $(id).append(`
                <div id="history-${index}" class="sharedItem section">    
                    <button id="history-btn-${index}" class="history-btn" type="button">share</button>
                    ${value.year} - ${value.html}
                </div>
            `);
        });
        */
    });

    $("#search").on("click", function (event) {
        event.preventDefault();
        userName = $("#name").val();
        dateSearched = $("#date").val();
        console.log("search:", userName, dateSearched);
        let isValid = validation(userName, dateSearched);
        if (isValid[0] == false) {
            // invalid username
            $("#name").attr("placeholder", "12 characters - letters & numbers only");
        } else if (isValid[1] == false) {
            // invalid date
            $("#date").attr("value", "choose a date from the datepicker calendar");
        } else {
            // parse date and make API call
            let searchMonth = parseInt(moment(dateSearched, "YYYY-MM-DD").format("M"));
            let searchDay = parseInt(moment(dateSearched, "YYYY-MM-DD").format("D"));
            console.log(dateSearched, searchMonth, searchDay);
            getHistory(month, day).then(function () {
                console.log(historyObj);
                postHistory();
            });
        }
    });

    $(document).on("click", ".history-btn", function (event) {
        let id = $(this).attr("id");
        id = id.substring(12, id.length);
        console.log("id", id);
        shareHistory(id);
    });

    // make API call on page load using current date
    let month = moment().format("M");
    let day = moment().format("D");
    console.log(month, day);
    //$.when(getHistory(month, day)).done(function () { //change to .done to .then and remove .when
    getHistory(month, day).then(function () {
        console.log(historyObj);
        postHistory("#history");
    });

}); //end ready js