//ready js
$(document).ready(function () {

    //onclick function to add content to nyt div
    $("#search").on("click", function (event) {
        event.preventDefault();

        let indate = $("#date").val();
        indate = indate.replace("-", "");
        indate = indate.replace("-", "");
        //.then used to wait for call function
        nytdata(indate).then(function (artArray) {
            for (let i3 = 0; i3 < 3; i3++) {
                let link = $("<a href='" + artArray[i3].web_url + "' target='_blank'>" + artArray[i3].headline + "</a>")
                let div = $("<div style='margin-top:10px'>").append(link);
                $("#nyt").prepend(div);
            }

            console.log(artArray[0]);
        })

    })

    //end ready js
});