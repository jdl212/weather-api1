class Weather{
/* API KEY for the openweathermap.org */
static APIKEY = "ad12608949fef6986f1bdefef755762b";
static BASEURL= "https://api.openweathermap.org/data/2.5/";
static UVURL  = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + Weather.APIKEY
static FIVEDAYURL = "https://api.openweathermap.org/data/2.5/forecast/daily?appid="+Weather.APIKEY 

static UV_INDEX_VALUE="" 
static DATE = ""
static CURRENT_HUMIDITY_LEVEL = "";
static CITY = ""; // input CITY name
static HUMIDITY_LEVEL = ""; 
static WIND_SPEED = "";
static CURRENT_ICON_URL = "";
static CURRENT_DATE = "";
static TEMP_F = ""; // temperature in Farenheit
static SEARCH_HISTORY_LIST = []; // stores names of cities searched
// load cities from localstorage of the browser to the CITYlist var.

constructor(){
  let localCities = JSON.parse(localStorage.getItem("cities"));
  if(localCities!=null){
    Weather.SEARCH_HISTORY_LIST=localCities;
    Weather.displaySearchHistory();
  }
}
static searchBtnOnClick = function (e) {
    // prevent default behavior. as we are clicking the form it will reload so to prevents reloading.
    e.preventDefault();
    Weather.clearWeatherInfo();
    let cityName = $("input").val().toUpperCase().trim(); // get the input CITY name
    $("#search-input").val(""); // clear the input box
    Weather.searchCity(cityName); //search the input cityName
    // if CITY name is not null and it is not equal to last CITY searched
    if (cityName !== "" && Weather.SEARCH_HISTORY_LIST.length  && Weather.SEARCH_HISTORY_LIST.indexOf(cityName)>=0) {
      Weather.SEARCH_HISTORY_LIST = Weather.SEARCH_HISTORY_LIST.filter(function(city){ city.toUpperCase()!=cityName.toUpperCase()});
      Weather.SEARCH_HISTORY_LIST.unshift(cityName.toUpperCase()); // push new CITY into history list
      localStorage.setItem("cities", JSON.stringify(Weather.SEARCH_HISTORY_LIST)); // upDATE local storage
      $('#cities-history > a').filter(function(e){ if($(this).attr("value")==cityName){$(this).remove();}});
      $("#cities-history").prepend(
        `<a href="#" class="list-item" id="${cityName}" value="${cityName}">
          ${cityName}
        </a>`
      );
    }else{
      Weather.SEARCH_HISTORY_LIST = Weather.SEARCH_HISTORY_LIST.filter(function(city){ city.toUpperCase()!=cityName.toUpperCase()});
      Weather.SEARCH_HISTORY_LIST.unshift(cityName.toUpperCase()); // push new CITY into history list
      localStorage.setItem("cities", JSON.stringify(Weather.SEARCH_HISTORY_LIST)); // upDATE local storage
      $('#cities-history > a').filter(function(e){ if($(this).attr("value")==cityName){$(this).remove();}});
      $("#cities-history").prepend(
        `<a href="#" class="list-item" id="${cityName}" value="${cityName}">
          ${cityName}
        </a>`
      );
    }
  }

  // clicked on earlier searched CITY, show its weather info.
  static onClickListItem= function (e) {
    console.log(e);
    var cityName = e;
    Weather.clearWeatherInfo();
    Weather.searchCity(cityName);      
  }
  // function generates one card for each day for next 5 days
  static displayForeCast = function (DATE, iconurl, minTemp, maxTemp) { 
    var cardTitleDiv = $("<div>").attr("class", "card-block"); // create a div element with class card-block
    var imgElement = $("<img>").attr("src", iconurl);  // create a img element with src equal icon
    var cardElement = $("<div class='card'>").addClass("pl-1 bg-primary text-light");// create a div element with class card.pl-1,bg-primary text-light
    var cardBlockDiv = $("<div>").attr("class", "card-block"); // create a div element with class card-block
    var cardTitleHeader = $("<h6>").text(DATE).addClass("pt-2"); // create a H6 heading with class pt-2
    var minTempElement = $("<p>").text("Min Temp: " + minTemp + " ºF").css("font-size", "0.60rem"); // create a paragraph element with min temperature
    var maxTempElement = $("<p>").text("Max Temp: " + maxTemp + " ºF").css("font-size", "0.60rem"); //create a paragraph element with max temperature
    var humidityElement = $("<p>").text("Humidity: " + Weather.CURRENT_HUMIDITY_LEVEL + "%").css("font-size", "0.60rem"); // create a paragraph element with current humidity level
  
    var cardTextDiv = $("<div>").attr("class", "card-text"); // create a div element with card class
    cardTextDiv.append(imgElement);//append element to card div
    cardTextDiv.append(maxTempElement); //append element to card div
    cardTextDiv.append(minTempElement);//append element to card div
    cardTitleDiv.append(cardTitleHeader);//append element to card  title div
    cardTextDiv.append(humidityElement);//append element to card div
    cardElement.append(cardBlockDiv);//append element to card element div
    cardBlockDiv.append(cardTitleDiv);//append element to card block div
    cardBlockDiv.append(cardTextDiv);//append element to card block div
    $(".card-deck").append(cardElement);//append card element to .card-deck class element
  }

  // display weather info of current day
  static displayCurrentWeather = function () {
  var weatherImage = $("<img>").attr('src', Weather.CURRENT_ICON_URL);// create img tag with src iconurl
  var cardHeader = $("<h4>").text(Weather.CITY + " " + Weather.CURRENT_DATE.toString());//create heading h4 with text CITYname and DATE
  cardHeader.append(weatherImage);//append card header with weather img tag
  var temperatureElement = $("<p>").text("Temperature: " + Weather.TEMP_F + " ºF");//create a paragraph tag with text temperature 
  var humidityElementement = $("<p>").text("Humidity Level: " + Weather.HUMIDITY_LEVEL + "%");//create a paragraph tag with text humidity level; 
  var WIND_SPEEDElement = $("<p>").text("Wind Speed: " + Weather.WIND_SPEED + " MPH");//create a paragraph tag with text wind speed 
  var uvIndexElement = $("<p>").text("UV Index Level: ");//create a paragraph tag with text UV index level 
  var UV_INDEX_VALUEElement = $("<span>").text(Weather.UV_INDEX_VALUE).css("background-color", Weather.getUVColor(Weather.UV_INDEX_VALUE));  // change background color based on level
  uvIndexElement.append(UV_INDEX_VALUEElement);//append index value  to uv index element
  
  var div = $("<div class='container border bg-light'>"); //create a div container
  div.append(cardHeader);//append to div container
  div.append(uvIndexElement);//append to div container
  div.append(temperatureElement);//append to div container
  div.append(humidityElementement);//append to div container
  div.append(WIND_SPEEDElement);//append to div container
  $("#current-weather-conditions").append(div);//append to current-weather-conditions id element
}
// delete weather elements (including current weather and 5 day forecast) from DOM
static clearWeatherInfo = function () {
  $("#current-weather-conditions").empty();//clear the current-weather-conditions id elemnt
  $("#card-deck-title").remove(); // remove the card-deck-title id elemnt 
  $(".card-deck").empty();// clear the .card-deck class element
}
static displaySearchHistory  =function () {
  $("#searched-cities").removeClass("hide"); //show the searched-cities elemnt by removing clas hide
  var count = Weather.SEARCH_HISTORY_LIST.length //the length of the searched cities
  $("#cities-history").css("list-style-type", "none");//the style of list is none
  for (var i=0; i < count; i++) {
    $("#cities-history").append(`<a href="#" class="list-item" style="color: black;"  id="${Weather.SEARCH_HISTORY_LIST[i]}" value="${Weather.SEARCH_HISTORY_LIST[i]}">
    ${Weather.SEARCH_HISTORY_LIST[i]}
    </a>`);
  }
  Weather.resetGlobalVariables(); // reset the global variables for next search
}
/*
get UV color based on uvIndex
*/
static getUVColor = function (uvIndex) {
  var uvValue = parseFloat(uvIndex);
  var color = "#00ff00";
  if ((uvValue > 2) && (uvValue <= 5))
    color = "#ffff00";
  else if ((uvValue > 5) && (uvValue <= 7))
    color = "#ffa500";
  else if ((uvValue > 7) && (uvValue <= 10))
    color = "#9e1a1a";
  else if (uvValue > 10)
    color = "#7f00ff";
  return color;
}


/**
 * Reset all global variable
 */
static resetGlobalVariables = function () {
  Weather.CITY = "";
  Weather.HUMIDITY_LEVEL = "";
  Weather.WIND_SPEED = "";
  Weather.CURRENT_HUMIDITY_LEVEL = "";
  Weather.CURRENT_ICON_URL = "";
  Weather.CURRENT_DATE = "";
  Weather.TEMP_F = "";
}

// make api request to query weather details of CITY
// we are using ajax call with promise , then function will start execution after the ajax function finished
static searchCity = function (cityName){
  var queryURL = Weather.BASEURL+"weather?q=" + cityName + "&appid=" + Weather.APIKEY;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
     var result = response;
     Weather.CITY = result.name.trim();
     Weather.CURRENT_DATE = moment.unix(result.dt).format("l");//get corrent DATE  format e.g ["01/03/2014", "01/05/2014"]
     console.log(Weather.CURRENT_DATE);//log in console
     var tempK = result.main.temp; //temperature
     var minTempK = "";
     var maxTempK = "";
     Weather.WIND_SPEED = result.wind.speed; //wind speed
     Weather.HUMIDITY_LEVEL = result.main.humidity; //humidity
     Weather.TEMP_F = ((tempK - 273.15) * 1.80 + 32).toFixed(1); // converting kelvin to farenheit
     var icon = result.weather[0].icon; // icon filename
     Weather.CURRENT_ICON_URL = "https://openweathermap.org/img/w/" + icon + ".png";
     var uvQueryUrl = Weather.UVURL + "&lat=" + result.coord.lat + "&lon=" + result.coord.lon;
     $.ajax({
       url: uvQueryUrl,
       method: "GET"
     })
     .then(function(response) {
       Weather.UV_INDEX_VALUE = response.value;
       Weather.displayCurrentWeather()  
     }); 
     // get next 5 days forecast
     var fiveDayQueryUrl = Weather.FIVEDAYURL+"&q=" + Weather.CITY + "&cnt=5";
       $.ajax({
         url: fiveDayQueryUrl,
         method: "GET"
       })
       .then(function(response) {
         var fiveDayForecast = response.list;
         var iconcode = "";
         var iconurl = "";
         // iterate each day
         for (var i=0; i < 5; i++) {
           iconcode = fiveDayForecast[i].weather[0].icon;
           iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
           Weather.DATE = moment.unix(fiveDayForecast[i].dt).format('l');
           minTempK = fiveDayForecast[i].temp.min;
           let minTemp =  ((minTempK-273.15)*1.80+32).toFixed(1); //changes to degree Celcius
           maxTempK = fiveDayForecast[i].temp.max;
           let maxTemp =  (((fiveDayForecast[i].temp.max)-273.15) * 1.80 + 32).toFixed(1); //changes to degree Celcius
           Weather.CURRENT_HUMIDITY_LEVEL = fiveDayForecast[i].humidity;
           Weather.displayForeCast(Weather.DATE, iconurl, minTemp, maxTemp)
         } 
       });
  });
 }
}


weather = new Weather();



$(document).on("click", ".list-item", function() {
  Weather.onClickListItem($(this).attr("value"));
});
$("#search-btn").on("click", function(e) {
  Weather.searchBtnOnClick(e);
});
