//ready js

//Variables to hold full alphabet and array to split them
var alphabet = "abcdefghijklmnopqrstuvwxyz ";

$(document).ready(function () {

$(".namealert").hide();
$(".datealert").hide();

    let username = "";
    
    //onclick function to add content to nyt div
    $("#search").on("click", function (event) {
        event.preventDefault();
        

        //Testing purposes
        $(".namealert").hide();
        $(".datealert").hide();
        
        username = $("#name").val();
        let indate = $("#date").val();
        let test = $("#name").val();
        
        console.log(test);
        let array = test.split("");
        let datearray = indate.split("-");

        array.forEach(function (char){

            if (!alphabet.includes(char)){
                $(".namealert").show('');
            }
            else if(datearray[0]>2019 && datearray[1]> 01 && datearray[2]>17){
                $(".datealert").show();

            }
            else{
              
                indate = indate.replace("-", "");
                indate = indate.replace("-", "");
                nytdiv(indate);   
            };
        });

  
        //Grab Values for Username and Date
             
    });

    //function that gets the data using nytdata and manipulates DOM
    function nytdiv(enterdate) {
        //.then used to wait for call function
        nytdata(enterdate).then(function (artArray) {
            let artobject = {
                username: username,
                searchdate: enterdate,
                dataArray: artArray
            };
            let div = $("<div class='card-panel nytpanel'>");
            let datehead = $("<h6 class='shareThis'>").text("NYT articles from " + moment(enterdate, "YYYYMMDD").format("MMMM Do YYYY"))
            for (let i3 = 0; i3 < artArray.length; i3++) {
                let link = $("<a href='" + artArray[i3].web_url + "' target='_blank'>" + artArray[i3].headline + "</a>")
                let linkdiv = $("<div style='margin-top:10px'>").append(link);
                div.append(linkdiv);
            }
            datehead.attr("data-array", JSON.stringify(artobject));
            div.prepend(datehead);
            $("#nyt").prepend(div);            
        });
    }

    nytdiv(moment().format("YYYYMMDD"));

    //end ready js
});