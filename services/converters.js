export const ctoF = (c) => (c * 9) / 5 + 32;

export const mpsToMph = (mps) => (mps * 2.236936).toFixed(2);

export const kmToMiles = (km) => (km / 1.609).toFixed(1);

export const timeTo12HourFormat = (time) => {
  let [hours, minutes] = time.split(":");
  return `${(hours %= 12) ? hours : 12}:${minutes}`;
};

export const degToCompass = (num) => {
  var val = Math.round(num / 22.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
};

export const unixToLocalTime = (unixSeconds, timezone) => {
  if (typeof unixSeconds !== "number" || isNaN(unixSeconds)) return "";
  if (typeof timezone !== "number" || isNaN(timezone)) timezone = 0;
  let date = new Date((unixSeconds + timezone) * 1000);
  if (isNaN(date.getTime())) return "";
  let match = date.toISOString().match(/(\d{2}:\d{2})/);
  if (!match) return "";
  let time = match[0];
  return time.startsWith("0") ? time.substring(1) : time;
};

export const weatherCodeMap = {
  0:  { desc: "Clear sky", icon: "01d" },
  1:  { desc: "Mainly clear", icon: "02d" },
  2:  { desc: "Partly cloudy", icon: "03d" },
  3:  { desc: "Overcast", icon: "04d" },
  45: { desc: "Fog", icon: "50d" },
  48: { desc: "Depositing rime fog", icon: "50d" },
  51: { desc: "Light drizzle", icon: "09d" },
  53: { desc: "Moderate drizzle", icon: "09d" },
  55: { desc: "Dense drizzle", icon: "09d" },
  56: { desc: "Light freezing drizzle", icon: "09d" },
  57: { desc: "Dense freezing drizzle", icon: "09d" },
  61: { desc: "Slight rain", icon: "10d" },
  63: { desc: "Moderate rain", icon: "10d" },
  65: { desc: "Heavy rain", icon: "10d" },
  66: { desc: "Light freezing rain", icon: "10d" },
  67: { desc: "Heavy freezing rain", icon: "10d" },
  71: { desc: "Slight snow fall", icon: "13d" },
  73: { desc: "Moderate snow fall", icon: "13d" },
  75: { desc: "Heavy snow fall", icon: "13d" },
  77: { desc: "Snow grains", icon: "13d" },
  80: { desc: "Slight rain showers", icon: "09d" },
  81: { desc: "Moderate rain showers", icon: "09d" },
  82: { desc: "Violent rain showers", icon: "09d" },
  85: { desc: "Slight snow showers", icon: "13d" },
  86: { desc: "Heavy snow showers", icon: "13d" },
  95: { desc: "Thunderstorm", icon: "11d" },
  96: { desc: "Thunderstorm with slight hail", icon: "11d" },
  99: { desc: "Thunderstorm with heavy hail", icon: "11d" }
};

export function getWeatherDescriptionAndIcon(code) {
  return weatherCodeMap[code] || { desc: `Weather code: ${code}`, icon: "01d" };
}
