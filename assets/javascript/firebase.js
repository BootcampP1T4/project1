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

    let dataRef = firebase.database();

    //onclick function to push data into firebase
    $(document).on("click", ".shareThis", function () {
        let dataObj = JSON.parse($(this).attr("data-array"));
        dataObj.userName = $("#name").val();
        if (dataObj.userName === "") {
            dataObj.userName = "Anonymous"
        }
        dataObj.dateAdded = firebase.database.ServerValue.TIMESTAMP;
        dataRef.ref("sharedData").push(dataObj);
    })


    //function to populate div wit the last child added
    dataRef.ref("sharedData").orderByChild("dateAdded").limitToLast(5).on("child_added", function (snapshot) {
        let shareLink = snapshot.val().userShared;
        let shareDate = snapshot.val().dateSearched;
        let shareName = snapshot.val().userName;
        let div = $("<div class='card-panel'>");
        let userhead = $("<h5>").text(shareName + " shares:");
        let datehead = $("<h6>").text("NYT article from " + moment(shareDate, "YYYYMMDD").format("MMMM Do YYYY"));
        let link = $(shareLink);
        let linkdiv = $("<div style='margin-top:10px'>").append(link);
        div.append(linkdiv);
        div.prepend(datehead);
        div.prepend(userhead);
        $("#share").prepend(div);
    }, function (error) {
        console.log("error:" + error);
    });


    //end ready js
});