//ready js
$(document).ready(function () {
    
    //function for nyt api call, must input "YYYYMMDD"
    function nytdata(inputDate) {
        let returnArray = [];
        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
          'api-key': "b9f91d369ff59547cd47b931d8cbc56b:0:74623931",
          'begin_date': inputDate,
          'end_date': inputDate,
          'fl': "web_url, snippet, headline"
        });
        $.ajax({
          url: url,
          method: 'GET',
        }).done(function (result) {
          for (let i = 0; i < 3; i++) {
            let dataObj = result.response.docs.splice(Math.floor(Math.random() * result.response.docs.length), 1)[0];
            let returnObj = {
              web_url: dataObj.web_url,
              headline: dataObj.headline.main,
              snippet: dataObj.snippet
            };
            returnArray.push(returnObj);
          };
        }).fail(function (err) {
          throw err;
        });
        console.log(returnArray);
        return returnArray;
      };

    //end ready js
});