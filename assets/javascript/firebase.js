//ready js
$(document).ready(function () {

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

    //onclick function to push data into firebase
    $(document).on("click", ".shareThis", function () {
        let dataObj = JSON.parse($(this).attr("data-array"));
        dataObj.userName = $("#name").val();
        if (dataObj.userName === "") {
            dataObj.userName = "Anonymous"
        }
        dataObj.dateAdded = firebase.database.ServerValue.TIMESTAMP;
        db.ref("sharedData").push(dataObj);
    })


    //function to populate div wit the last child added
    db.ref("sharedData").orderByChild("dateAdded").limitToLast(5).on("child_added", function (snapshot) {
        let datehead = ""
        let shareLink = snapshot.val().userShared;
        let shareDate = snapshot.val().dateSearched;
        let shareName = snapshot.val().userName;
        let div = $("<div class='card-panel'>");
        if (snapshot.val().api === "nyt") {
            datehead = $("<h6>").text(shareName + " shared a NYT article from " + moment(shareDate, "YYYYMMDD").format("MMM D YYYY"));
        } else if (snapshot.val().api === "history") {
            datehead = $("<h6>").text(shareName + " shared an event from " + moment(shareDate, "YYYYMMDD").format("MMM D YYYY"));
        }
        let link = $("<div>").html(shareLink);
        let linkdiv = $("<div style='margin-top:10px'>").append(link);
        div.append(linkdiv);
        div.prepend(datehead);
        $("#share").prepend(div);
    }, function (error) {
        console.log("error:" + error);
    });

    //post to firebase
    function shareHistory(index) {
        db.ref("sharedData").push({
            api: "history",
            dateAdded: moment().valueOf(), // .unix(),
            dateSearched: moment(dateSearched, "YYYY-MM-DD").format("YYYYMMDD"),
            userName: userName,
            userShared: historyObj.events[index].html
        });
        console.log(historyObj);
    }

    $(document).on("click", ".history-btn", function (event) {
        let id = $(this).attr("id");
        id = id.substring(12, id.length);
        //console.log("id", id);
        shareHistory(id);
    });



    //end ready js
});