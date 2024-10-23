import React, { useEffect, useState } from "react";
import "./css/style.css";

const Tempapp = () => {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null); 
  const [search, setSearch] = useState("Mumbai");
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTodaySummary, setShowTodaySummary] = useState(false);
  const [showFiveDaySummary, setShowFiveDaySummary] = useState(false);
  const [threshold, setThreshold] = useState(35); 
  const [consecutiveBreaches, setConsecutiveBreaches] = useState(0);
  const [alertTriggered, setAlertTriggered] = useState(false);


  useEffect(() => {
    const fetchApi = async () => {
      if (search.trim() === "") {
        return; 
      }

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=68b8125622f1183d323012cb4fa54f94`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("City not found");
        }

        const resJson = await response.json();
        setCity(resJson.main);
        setWeather(resJson.weather[0]); 
        setError(null);
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=metric&appid=68b8125622f1183d323012cb4fa54f94`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastJson = await forecastResponse.json();
        setForecast(forecastJson.list); 
        if (resJson.main.temp > threshold) {
            setConsecutiveBreaches((prev) => prev + 1);
          } else {
            setConsecutiveBreaches(0);
          }
  
          if (consecutiveBreaches >= 2 && !alertTriggered) {
            setAlertTriggered(true);
            alert(`Alert!:Alert! Alert! Temperature has exceeded ${threshold}°C Alert!`);
          }
      } catch (error) {
        setCity(null);
        setWeather(null); 
        setError(error.message);
      }
    };

    fetchApi();
  }, [search, threshold, consecutiveBreaches, alertTriggered]);
  useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.querySelector('.dropdown');
            if (dropdown && !dropdown.contains(event.target) && !event.target.classList.contains('dropdownButton')) {
              setShowDropdown(false);
              setShowTodaySummary(false);
              setShowFiveDaySummary(false);
            }
          };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  const toggleTodaySummary = () => {
    setShowTodaySummary((prev) => !prev);
    setShowFiveDaySummary(false);
  };

  const toggleFiveDaySummary = () => {
    setShowFiveDaySummary((prev) => !prev);
    setShowTodaySummary(false);
  };
  const getCurrentDateTime = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const datePart = new Date().toLocaleDateString('en-US', options);
    const timePart = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  
    return `${datePart} | ${timePart}`;
  };
  const handleThresholdChange = (event) => {
    setThreshold(event.target.value);
    setConsecutiveBreaches(0);
    setAlertTriggered(false);
  };

  const getWeatherIcon = () => {
    if (!weather) return ""; 
    const weatherMain = weather.main.toLowerCase();

    switch (weatherMain) {
      case "clear":
        return <i className="fas fa-sun" style={{ color: "orange" }}></i>; 
      case "clouds":
        return <i className="fas fa-cloud" style={{ color: "white" }}></i>; 
      case "rain":
        return <i className="fas fa-cloud-showers-heavy" style={{ color: "#3498db" }}></i>; 
      default:
        return <i className="fas fa-cloud-sun" style={{ color: "#f39c12" }}></i>; 
    }
  };
  const getDailyForecast = () => {
    const dailyForecast = [];
    const uniqueDays = new Set();

    forecast.forEach((day) => {
      const date = new Date(day.dt * 1000).toLocaleDateString();

      if (!uniqueDays.has(date) && dailyForecast.length < 5) {
        uniqueDays.add(date);
        dailyForecast.push(day);
      }
    });

    return dailyForecast;
  };
  const getCurrentDaySummary = () => {
    if (!city || !weather) return null;
    return (
      <div className="currentDaySummary">
        <h4>Today's Summary</h4>
        <p>Temperature: {city.temp}°C</p>
        <p>Min Temperature: {city.temp_min}°C</p>
        <p>Max Temperature: {city.temp_max}°C</p>
        <p>Humidity: {city.humidity}%</p>
        <p>Wind Speed: {weather.speed} m/s</p>
        <p>Condition: {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p>
        <div className="weatherIcon">{getWeatherIcon()}</div>
      </div>
    );
  };
  return (
    <>
      <div className="box">
        <div className="inputData">
        <button onClick={toggleDropdown} className="dropdownButton">
            {showDropdown ? " Menu" : " Menu"}
          </button>

          {showDropdown && (
            <div className="dropdown">
              <div className="dropdownItem">
                <button onClick={toggleTodaySummary} className="summaryButton">
                  Today's Summary
                </button>
                {showTodaySummary && getCurrentDaySummary()}
              </div>
              <div className="dropdownItem">
                <button onClick={toggleFiveDaySummary} className="summaryButton">
                  5 Days Summary
                </button>
                {showFiveDaySummary && (
                  <div>
                    {getDailyForecast().map((day, index) => (
                      <div key={index} className="dropdownForecastItem">
                        <h4>{new Date(day.dt * 1000).toLocaleDateString()}</h4>
                        <p>Temp: {day.main.temp}°C</p>
                        <p>Condition: {day.weather[0].description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <input
            type="search"
            value={search}
            className="inputField"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Enter city name"
          />
          <label htmlFor="threshold">Temperature Threshold (°C): </label>
          <input
            type="number"
            id="threshold"
            value={threshold}
            onChange={handleThresholdChange}
            min="0"
          />

        </div>

        {!city ? (
          <p className="errorMsg">{error ? error : "No Data Found"}</p>
        ) : (
          <div>
            <div className="weatherDescriptionContainer">
            <p className="weatherDescription">{weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</p>
          </div>
            <div className="info">
              <h2 className="location">
                <i className="fas fa-street-view"></i> {search}
              </h2>
              <p id="date">{getCurrentDateTime()}</p>
              <h1 className="temp">{city.temp}°C</h1>
              <h3 className="tempmin_max">
                Min: {city.temp_min}°C | Max: {city.temp_max}°C
              </h3>
              
            </div>
            <div className="weathercon">{getWeatherIcon()}</div>
            
            <div className="wave -one"></div>
            <div className="wave -two"></div>
            <div className="wave -three"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tempapp;
