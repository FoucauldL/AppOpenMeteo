import config from "../../config.json";
import { getWeatherDescriptionAndIcon } from "../../services/converters"

export default async function handler(req, res) {
  const { latitude, longitude, city, country } = config;
  const getWeatherData = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,visibility&daily=sunrise,sunset&timezone=auto`
  );
  const data = await getWeatherData.json();

  let humidity = null;
  if ('relative_humidity' in data.current_weather) {
    humidity = data.current_weather.relative_humidity;
  } else if (data.hourly?.relative_humidity_2m && data.hourly?.time) {
    const currentTime = new Date(data.current_weather.time).getTime();
    const times = data.hourly.time.map(t => new Date(t).getTime());
    const humidities = data.hourly.relative_humidity_2m;
    let minDiff = Infinity;
    let closestHumidity = null;
    for (let i = 0; i < times.length; i++) {
      const diff = Math.abs(times[i] - currentTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestHumidity = humidities[i];
      }
    }
    humidity = closestHumidity;
  }

  let visibility = null;
  if ('visibility' in data.current_weather) {
    visibility = data.current_weather.visibility;
  } else if (data.hourly?.visibility && data.hourly?.time) {
    const currentTime = new Date(data.current_weather.time).getTime();
    const times = data.hourly.time.map(t => new Date(t).getTime());
    const visibilities = data.hourly.visibility;
    let minDiff = Infinity;
    let closestVisibility = null;
    for (let i = 0; i < times.length; i++) {
      const diff = Math.abs(times[i] - currentTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestVisibility = visibilities[i];
      }
    }
    // Open-Meteo visibility is in meters, convert to km for metric
    visibility = closestVisibility;
  }

  const code = data.current_weather.weathercode;
  const weatherInfo = getWeatherDescriptionAndIcon(code);

  // Récupération du lever et coucher du soleil via daily
  let sunrise = null;
  let sunset = null;
  if (data.daily?.sunrise && data.daily?.sunset && data.daily?.time) {
    const currentDate = data.current_weather.time.split("T")[0];
    const idx = data.daily.time.findIndex(t => t === currentDate);
    if (idx !== -1) {
      sunrise = new Date(data.daily.sunrise[idx]).getTime() / 1000;
      sunset = new Date(data.daily.sunset[idx]).getTime() / 1000;
    }
  }

  // Correction : récupération de la température ressentie via hourly si absente dans current_weather
  let feels_like = null;
  if ('apparent_temperature' in data.current_weather && data.current_weather.apparent_temperature !== undefined && data.current_weather.apparent_temperature !== 0) {
    feels_like = data.current_weather.apparent_temperature;
  } else if (data.hourly?.apparent_temperature && data.hourly?.time) {
    const currentTime = new Date(data.current_weather.time).getTime();
    const times = data.hourly.time.map(t => new Date(t).getTime());
    const feelsLikeArr = data.hourly.apparent_temperature;
    let minDiff = Infinity;
    let closestFeelsLike = null;
    for (let i = 0; i < times.length; i++) {
      const diff = Math.abs(times[i] - currentTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestFeelsLike = feelsLikeArr[i];
      }
    }
    feels_like = closestFeelsLike;
  }

  res.status(200).json({
    name: city,
    sys: { 
      country, 
      sunrise,
      sunset 
    },
    main: {
      temp: data.current_weather.temperature,
      feels_like,
      humidity
    },
    wind: {
      speed: data.current_weather.windspeed ?? null,
      deg: data.current_weather.winddirection ?? null
    },
    visibility,
    weather: [
      {
        description: weatherInfo.desc,
        icon: weatherInfo.icon
      }
    ],
    dt: Math.floor(new Date(data.current_weather.time).getTime() / 1000),
    timezone: data.utc_offset_seconds
  });
}
