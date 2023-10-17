var unit = "C";
// prettier-ignore
var weatherIcons = {
  "clear sky": "clear.png",
  "few clouds": "partlycloudy.png",
  "scattered clouds": "cloudy.png",
  "broken clouds": "cloudy.png",
  "light rain": "rainy.png",
  "shower rain": "rainy.png",
  "rain" : "rainy.png",
  "thunderstorm": "storm.png",
  "thunderstorm with heavy rain": "storm.png" ,
  "snow": "snow.png",
  "mist": "foggy.png"};

// prettier-ignore
var weatherBackgrounds = {
    "clear sky": "clear-sky.jpg",
    "few clouds": "cloudy.jpg",
    "scattered clouds": "cloudy.jpg",
    "broken clouds": "cloudy.jpg",
    "rain": "rainy.jpg",
    "light rain": "rainy.jpg",
    "snow": "snow.jpg",
    "thunderstorm": "storm.png",
    "thunderstorm with heavy rain": "storm.jpg" 
};

$(".form-check-input").prop("checked", true);

function getLocation() {
  $.getJSON("https://freeipapi.com/api/json", function (data) {
    getWeather(data.cityName);
  });
}

function getWeather(city) {
  var api = "https://api.openweathermap.org/data/2.5/weather?q=";
  var units = "&units=metric";
  var appid = "&APPID=4446374f4b73b8642414b29fc2a41c4c";
  var $http = api + city + units + appid;

  $.getJSON($http, function (data) {
    var temp = data.main.temp.toFixed(0);
    var status = data.weather[0].description;
    var pressure = data.main.pressure ? Math.round(data.main.pressure) : "N/a ";
    var humidity = data.main.humidity ? Math.round(data.main.humidity) : "N/a ";
    var windSpeed = data.wind.speed
      ? (data.wind.speed * 3.6).toFixed(0)
      : "N/a ";
    var windDirection = data.wind.deg ? data.wind.deg.toFixed(0) : "N/a ";
    var city = data.name;
    var country = data.sys.country;
    var status1 = data.weather[0].description.toLowerCase();
    var inputTextValue = city + ", " + country;

    console.log(status1);

    $("#location").val(inputTextValue);
    $("#temperature").text(temp);
    $("#status").text(status.charAt(0).toUpperCase() + status.slice(1));
    $(".pressure").text(pressure + " hPa");
    $(".humidity").text(humidity + " %");
    $(".windSpeed").text(windSpeed);
    $(".windDirection").text(
      windDirection + "deg " + degToCompass(windDirection)
    );

    if (weatherIcons[status1]) {
      $("#weather-icon").attr("src", "assets/" + weatherIcons[status1]);
    } else {
      $("img[src='assets/weather.png']").attr("src", "assets/default.png");
    }

    if (weatherBackgrounds[status1]) {
      $("body").css(
        "background-image",
        "url('assets/" + weatherBackgrounds[status1] + "')"
      );
    } else {
      $("body").css("background-image", "url('assets/default.jpg')");
    }
  });
}

function degToCompass(num) {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = [
    "(N)",
    "(NNE)",
    "(NE)",
    "(ENE)",
    "(E)",
    "(ESE)",
    "(SE)",
    "(SSE)",
    "(S)",
    "(SSW)",
    "(SW)",
    "(WSW)",
    "(W)",
    "(WNW)",
    "(NW)",
    "(NNW)",
  ];
  return arr[val % 16] || "";
}

function celsius_F() {
  var temp = parseFloat($("#temperature").text());
  var windSpeed = parseFloat($(".windSpeed").text());

  if (unit == "F") {
    unit = "C";
    temp = Math.round(((temp - 32) * 5) / 9);
    windSpeed = Math.round(windSpeed * 1.609344);
    $(".windSpeedUnit").text("km/h");
  } else if (unit == "C") {
    unit = "F";
    temp = Math.round((temp * 9) / 5 + 32);
    windSpeed = Math.round(windSpeed * 0.62137119223733);
    $(".windSpeedUnit").text("mph");
  }

  $("#temperature").text(temp);
  $("#unit").text("°" + unit);
  $(".windSpeed").text(windSpeed);
}

function getDate() {
  var d = new Date();
  var date = d.toLocaleDateString();
  $("#date").html(date);
}

function getClock() {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();

  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);

  $("#time").text(h + ":" + m + ":" + s);
  setTimeout(getClock, 500);
}

function checkTime(i) {
  return i < 10 ? "0" + i : i;
}
$(document).ready(function () {
  getLocation();
  getDate();
  getClock();
  $("#celsius_F").on("change", function () {
    celsius_F();
  });

  $("form").on("submit", function (e) {
    e.preventDefault();
    var city = $("#location").val().split(",")[0];
    getWeather(city);
  });

  $("#currentLocationBtn").click(function () {
    getLocation();
  });
});
