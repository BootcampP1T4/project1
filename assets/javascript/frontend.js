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
        console.log("testname:" + testName);
        console.log("testdate:" + testDate);
        let regex = /^[A-Za-z0-9_]+$/;
        console.log("reg", regex.test(testName));
        if (regex.test(testName) &&
            testName.length > 0 &&
            testName.length <= 12) {
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
            console.log(testDate)
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
        console.log("valid", isValid)
        $("#invalidName").empty()
        $("#invalidDate").empty()
        if (isValid[0] == false) {
            // invalid username
            $("#invalidName").text("Invalid username: Enter up to 12 characters - letters & numbers only");
        }
        if (isValid[1] == false) {
            // invalid date
            $("#invalidDate").text("Invalid date: Enter a current or historical date");
            return;
        }
        if (isValid[0] && isValid[1]) {
            // parse date and make API call
            let searchMonth = parseInt(moment(dateSearched, "YYYY-MM-DD").format("M"));
            let searchDay = parseInt(moment(dateSearched, "YYYY-MM-DD").format("D"));
            console.log(dateSearched, searchMonth, searchDay);
            $("#nyt").prepend($("<div class='card-panel'>").prepend($("<h4>Loading Data...</h4>"))); //Holds place with message "Loading Data..." until api call completes
            $("#history").prepend($("<div class='card-panel'>").prepend($("<h4>Loading Data...</h4>"))); //Holds place with message "Loading Data..." until api call completes
            postAPI("nyt", true);
            getHistory(searchMonth, searchDay).then(function () {
                console.log(historyObj);
                $("#history").empty();
                postAPI("history", true);                
            });
        };
    });

    function postAPI(id, valid) {
        if (id == "history") {
            let card = $("<div class='card-panel'>");
            $.each(historyObj.events, function (index, value) {
                let button;
                //console.log(value);
                if (valid) {
                    button = `<button id="history-btn-${index}" class="history-btn" type="button">share</button>`
                }
                card.append(`
                    <div id="history-${index}" class="sharedItem section">    
                        ${button}
                        ${value.year} - ${value.html}
                    </div>
                `);
            });
            let dateHeader = $("<h6>").html("Historical events: " + moment(dateSearched, "YYYY-MM-DD").format("MMM") + " " + moment(dateSearched, "YYYY-MM-DD").format("Do"));
            card.prepend(dateHeader);           
            $("#history").prepend(card);
        } else if (id == "nyt") {
            // Aaron's code
            let formDate = $("#date").val();
            formDate = formDate.replace("-", "");
            formDate = formDate.replace("-", "");
            postNYT(formDate, valid);
        };
    };

    //function that gets the data using getNYT and manipulates DOM
    function postNYT(enterDate, valid) {        
        //.then used to wait for call function
        getNYT(enterDate, 0).then(function (NYTArray1) {
            getNYT(enterDate, 1).then(function (NYTArray2) {
                let NYTArray = NYTArray1.concat(NYTArray2);
                let card = $("<div class='card-panel'>");
                let datehead = $("<h6>").text("NYT articles: " + moment(enterDate, "YYYYMMDD").format("MMM D, YYYY"))
                for (let articleCounter = 0; articleCounter < NYTArray.length; articleCounter++) {
                    let link = $("<a href='" + NYTArray[articleCounter].web_url + "' target='_blank'> " + NYTArray[articleCounter].headline + "</a>");
                    let NYTObject = {
                        api: "nyt",
                        dateSearched: enterDate,
                        userShared: "<a href='" + NYTArray[articleCounter].web_url + "' target='_blank'>" + NYTArray[articleCounter].headline + "</a>"
                    };
                    let sharebtn = $("<button class='shareThis'>share</button>");
                    sharebtn.attr("data-array", JSON.stringify(NYTObject));
                    let contentLink = $("<div style='margin-top:20px'>");
                    if (valid) {
                        contentLink.append(sharebtn);
                    };
                    contentLink.append(link);
                    card.append(contentLink);
                };                
                card.prepend(datehead);
                $("#nyt").empty();                
                $("#nyt").prepend(card);
            });
        });
    };

    $("#nyt").prepend($("<div class='card-panel'>").prepend($("<h4>Loading Data...</h4>"))); //Holds place with message "Loading Data..." until api call completes
    postNYT(moment().format("YYYYMMDD"), false);

    // make API call on page load using current date
    let month = moment().format("M");
    let day = moment().format("D");
    console.log(month, day);
    $("#history").prepend($("<div class='card-panel'>").prepend($("<h4>Loading Data...</h4>"))); //Holds place with message "Loading Data..." until api call completes
    //$.when(getHistory(month, day)).done(function () { //change to .done to .then and remove .when
    getHistory(month, day).then(function () {
        console.log(historyObj);
        postAPI("history", false);
    });


    //end ready js
});