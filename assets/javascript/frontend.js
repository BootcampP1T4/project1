// default to [blank] and current date
let userName = "Anonymous";
let dateSearched = moment().format("YYYY-MM-DD");
let snapshotFirebase = {};

//ready js
$(document).ready(function () {

    //sidenav
    const sideNav = document.querySelector('.sidenav');
    M.Sidenav.init(sideNav, {});
    //Slider
    const slider = document.querySelector('.slider');
    M.Slider.init(slider, {
        indicators: false,
        height: 300,
        transition: 300,
        interval: 7000
    });

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
                postHistory("history");
                postHistory("nyt");
            });
        };
    });

    // add to html to force all links to open in new tab
    // <base target="_blank">
    //post API response to DOM
    function postHistory(id) {
        if (id == "#history") {
            let card = $("<div class='card-panel'>");
            $.each(historyObj.events, function (index, value) {
                //console.log(value);
                card.append(`
                    <div id="history-${index}" class="sharedItem section">    
                        <button id="history-btn-${index}" class="history-btn" type="button">share</button>
                        ${value.year} - ${value.html}
                    </div>
                `);
            });
            let dateheader = $("<h6>").text("Historical events on " + moment(month, "M").format("MMM") + " " + moment(day, "D").format("Do"));
            card.prepend(dateheader);
            $(id).prepend(card);
        } else if (id == "nyt") {
            // Aaron's code
            let indate = $("#date").val();
            indate = indate.replace("-", "");
            indate = indate.replace("-", "");
            nytdiv(indate);
        };
    };

    /*
        //onclick function to add content to nyt div
        $("#search").on("click", function (event) {
            event.preventDefault();
            let indate = $("#date").val();
            indate = indate.replace("-", "");
            indate = indate.replace("-", "");
            nytdiv(indate);
        });
        */

    //function that gets the data using nytdata and manipulates DOM
    function nytdiv(enterdate) {
        $("#nyt").prepend($("<div class='card-panel'>").prepend($("<h4>Loading Data...</h4>")));
        //.then used to wait for call function
        nytdata(enterdate, 0).then(function (artArray1) {
            nytdata(enterdate, 1).then(function (artArray2) {
                let artArray = artArray1.concat(artArray2);
                let div = $("<div class='card-panel'>");
                let datehead = $("<h6>").text("NYT articles from " + moment(enterdate, "YYYYMMDD").format("MMM Do YYYY"))
                for (let i3 = 0; i3 < artArray.length; i3++) {
                    let link = $("<a href='" + artArray[i3].web_url + "' target='_blank'> " + artArray[i3].headline + "</a>");
                    let artobject = {
                        api: "nyt",
                        dateSearched: enterdate,
                        userShared: "<a href='" + artArray[i3].web_url + "' target='_blank'>" + artArray[i3].headline + "</a>"
                    };
                    let sharebtn = $("<button class='shareThis'>share</button>");
                    sharebtn.attr("data-array", JSON.stringify(artobject));
                    let linkdiv = $("<div style='margin-top:20px'>");
                    linkdiv.append(sharebtn);
                    linkdiv.append(link);
                    div.append(linkdiv);
                }

                div.prepend(datehead);
                $("#nyt").empty();
                $("#nyt").prepend(div);
            });
        });
    };

    nytdiv(moment().format("YYYYMMDD"));

    // make API call on page load using current date
    let month = moment().format("M");
    let day = moment().format("D");
    console.log(month, day);
    //$.when(getHistory(month, day)).done(function () { //change to .done to .then and remove .when
    getHistory(month, day).then(function () {
        console.log(historyObj);
        postHistory("#history");
    });


    //end ready js
});