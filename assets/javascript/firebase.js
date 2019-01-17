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
        dataObj.dateAdded = firebase.database.ServerValue.TIMESTAMP;
        dataRef.ref("nyt").push(dataObj);
    })


    //function to populate div wit the last child added
    dataRef.ref("nyt").orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
        let shareArray = snapshot.val().dataArray;
        let shareDate = snapshot.val().searchdate;
        let shareName = snapshot.val().username;
        let div = $("<div class='card-panel'>")
        let userhead = $("<h5>").text(shareName + " shares:")
        let datehead = $("<h6>").text("NYT articles from " + moment(shareDate, "YYYYMMDD").format("MMMM Do YYYY"))
        for (let i3 = 0; i3 < shareArray.length; i3++) {
            let link = $("<a href='" + shareArray[i3].web_url + "' target='_blank'>" + shareArray[i3].headline + "</a>")
            let linkdiv = $("<div style='margin-top:10px'>").append(link);
            div.append(linkdiv);
        }
        div.prepend(datehead);
        div.prepend(userhead);
        $("#share").prepend(div);
    }, function (error) {
        console.log("error:" + error);
    });


    //end ready js
});