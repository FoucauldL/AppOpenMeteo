import config from "../../config.json";

export default async function handler(req, res) {
  const { latitude, longitude, city, country } = config;
  const getWeatherData = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );
  const data = await getWeatherData.json();

  res.status(200).json({
    name: city,
    sys: { 
      country, 
      sunrise: null,
      sunset: null 
    },
    main: {
      temp: data.current_weather.temperature,
      feels_like: data.current_weather.apparent_temperature ?? data.current_weather.temperature,
      humidity: data.current_weather.relative_humidity ?? null
    },
    wind: {
      speed: data.current_weather.windspeed ?? 0,
      deg: data.current_weather.winddirection ?? 0
    },
    visibility: data.current_weather.visibility ?? 0,
    weather: [
      {
        description: "Weather code: " + data.current_weather.weathercode,
        icon: "01d"
      }
    ],
    dt: Math.floor(new Date(data.current_weather.time).getTime() / 1000),
    timezone: data.utc_offset_seconds
  });
}
