//function for nyt api call, must input "YYYYMMDD". Returns an array with objects inside that holds web url, headline, and snippet.
function nytdata(inputDate) {
  let returnArray = [];
  var url = "https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json";
  url += '?' + $.param({
    'api-key': "2RFlsMjGt55kuosoq0pTUEU2ZMzMJA6R",
    'begin_date': inputDate,
    'end_date': inputDate,
    'fl': "web_url, snippet, headline"
  });
  return $.ajax({
    url: url,
    method: 'GET',
    //.then used to wait for the return of promise
  }).then(function (result) {
    for (let i1 = 0; i1 < result.response.docs.length; i1++) {
      let dataObj = result.response.docs[i1];
      let returnObj = {
        web_url: dataObj.web_url,
        headline: dataObj.headline.main,
        snippet: dataObj.snippet
      };
      returnArray.push(returnObj);
    };
    return returnArray;
  }).fail(function (err1) {
    throw err1;
  });
 
};


//function for giphy api call, must input name in string form. Grabs random gif from search and returns an object with still & animated url link.
function giphydata(inputName) {
  let returnGifObj = {};
  let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=1iThDCkeb2A5dgCTRBPi2BGTzcgjjBpt&limit=10&q=" + inputName;
  $.ajax({
      url: queryURL,
      method: "GET"
  }).done(function (response) {
      let results = response.data;
      let randInd = Math.floor(Math.random() * results.length);
      returnGifObj = {
          still: results[randInd].images.fixed_height_still.url,
          ani: results[randInd].images.fixed_height.url
      };
  }).fail(function (err2) {
      throw err2;
  });
  console.log(returnGifObj);
  return(returnGifObj);
};