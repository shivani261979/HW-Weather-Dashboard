var apiKey = "8e717aa85a556dd365a9ea822fa56b56";
var curCity = "";

// this includes UV index. Though does not work with cities. Second Call 
function getCompleteWeatherApiUrlForCoord(lat, lon){
    return "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" +"&appid=" + apiKey;
}

// Provide City as argument and then post Ajax call . First Call 
function getCurrentWeatherForCity(city){
    return "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;
}

function showWeather(){

    var city = $("#get-weather").val();
    showWeatherForCity(city);
} 

function showWeatherForCity(city){
    console.log("show weather for city - ", city);
    getCoordForCity(city);
}

function getCoordForCity(city){

    var urlToCall = getCurrentWeatherForCity(city);
            // using this to fetch coordinates only

    console.log("url called: " + urlToCall);

    $.ajax({
        url: urlToCall,
        method: "GET"
    }).then(function(response){
        console.log("response holds: " , response);

        fetchWeatherForCoord(response.coord);
        curCity = city;
    });

}

function fetchWeatherForCoord(coord){

    var urlToCall = getCompleteWeatherApiUrlForCoord(coord.lat, coord.lon);

    $.ajax({
        url: urlToCall,
        method: "GET"
    }).then(function(response){
        console.log("response holds: " , response);

        populateWeather(response);
        populateHistory(curCity);
    });
}

var arrCities = [];

function populateHistory(city){

    arrCities.push(city);
    $("#search-list").empty();


    for(var x=0; x < arrCities.length; x++){

        var li_item = "<li>" + "<a onclick=\"showWeatherForCity(\"" + arrCities[x] + "\"); return true;\" href=\"#search-list\">" + arrCities[x] + "</a>" + "</li>";
        // var li_item = "<li>" + "<button onclick=\"showWeatherForCity(\"" + arrCities[x] + "\");\" >" + arrCities[x] + "</button>" + "</li>";
        $("#search-list").append(li_item);
    }
}


function populateWeather(jsonWeather){

    $("#cityAndDate").text(curCity + " (" +  getDateFrom(jsonWeather.current.dt) +")" );
    $("#temp").text("Temperature: " + jsonWeather.current.temp);
    $("#humidity").text("Humidity: " + jsonWeather.current.humidity);
    $("#wind").text("Wind: " + jsonWeather.current.wind_speed);
    $("#uvIndex").text("UV Index: " + jsonWeather.current.uvi);

        //  populate forecast weather

    var jsonDaily = jsonWeather.daily;

    var dateElements = $('.date');
    var tempElements = $('.temp');
    var humidityElements = $('.humidity');
    var wIconElements = $('.wicon');

    for(var x=0; x < 5; x++){

        var imgFile = "./Assets/" + jsonDaily[x].weather[0].main + ".png";

        $(dateElements[x]).text( getDateFrom(jsonDaily[x].dt) );
        $(wIconElements[x]).attr("src",  imgFile  );
        $(tempElements[x]).text("Temp: " + jsonDaily[x].temp.day)
        $(humidityElements[x]).text("Humidity: " + jsonDaily[x].humidity)

    }
}

function getDateFrom(secSinceEpoch){

    var d = new Date(secSinceEpoch*1000);

    return getMmDdYyFromDate(d);
}

function getMmDdYyFromDate(inDate){

    var month = inDate.getMonth()+1;
    var day = inDate.getDate();
    var year = inDate.getFullYear();

    return month + "/" + day + "/" + year;
}

function populateDates(){

    var todDate = new Date();

    $('#cityAndDate').text(" - (" + getMmDdYyFromDate(todDate) + ")");
        // forecast dates

    var dateElements = $('.date');

    for(var x=1; x <= 5; x++){
        $(dateElements[x-1]).text( getMmDdYyFromDate( addDays(todDate, x) ) );
    }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

$(document).ready(function(){
    populateDates();
});
