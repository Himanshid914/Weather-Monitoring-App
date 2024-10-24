Weather Forecast Application


This is a weather forecast application built using React that allows users to search for the weather of any city and view a 5-day forecast, along with an alert feature for high temperatures.

Features:
* Search for current weather and forecast by city.
* View today's temperature summary and a 5-day temperature summary.
* Set temperature threshold alerts for consecutive breaches.
*Responsive user interface with weather icons.

Prerequisites:
Before running the application, make sure you have the following installed:
Node.js (v14 or later)
npm (comes with Node.js)

Installation:
npm install
Dependencies
The following are the major dependencies required for the application:

React: JavaScript library for building the user interface.
OpenWeatherMap API: To fetch the weather data.
Font Awesome: For displaying weather icons.

To install dependencies, run:

npm install react font-awesome

Environment Variables
To run the application, you need an API key from OpenWeatherMap. Create a .env file in the root directory and add the following:

makefile

REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
Running the Application
To start the development server, run:

npm start

The application will run on http://localhost:3000/.

Testing:
This application uses @testing-library/react for testing.

Run tests using:

npm test

