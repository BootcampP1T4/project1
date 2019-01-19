//ready js

//Variables to hold full alphabet and array to split them
var alphabet = "abcdefghijklmnopqrstuvwxyz ";

$(document).ready(function () {

    //onclick function to add content to nyt div
    $("#searchBREAK").on("click", function (event) {
        event.preventDefault();
        let indate = $("#date").val();
        indate = indate.replace("-", "");
        indate = indate.replace("-", "");
        nytdiv(indate);
    });

    //function that gets the data using nytdata and manipulates DOM
    function nytdiv(enterdate) {
        //.then used to wait for call function
        nytdata(enterdate).then(function (artArray) {
            let div = $("<div class='card-panel nytpanel'>");
            let datehead = $("<h6>").text("NYT articles from " + moment(enterdate, "YYYYMMDD").format("MMMM Do YYYY"))
            for (let i3 = 0; i3 < artArray.length; i3++) {
                let link = $("<a href='" + artArray[i3].web_url + "' target='_blank'>" + artArray[i3].headline + "</a>");
                let artobject = {
                    api: "nyt",
                    dateSearched: enterdate,
                    userShared: "<a href='" + artArray[i3].web_url + "' target='_blank'>" + artArray[i3].headline + "</a>"
                };
                let sharebtn = $("<button class='shareThis'>Share</button>");
                sharebtn.attr("data-array", JSON.stringify(artobject));
                let linkdiv = $("<div style='margin-top:10px'>");
                linkdiv.append(sharebtn);
                linkdiv.append(link);
                div.append(linkdiv);
            }

            div.prepend(datehead);
            $("#nyt").prepend(div);
        });
    };

    nytdiv(moment().format("YYYYMMDD"));

    //end ready js
});