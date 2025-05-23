import { useState, useEffect } from "react";
import config from "../config.json";

import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { Header } from "../components/Header";
import { DateAndTime } from "../components/DateAndTime";
import { MetricsBox } from "../components/MetricsBox";
import { LoadingScreen } from "../components/LoadingScreen";

import styles from "../styles/Home.module.css";

export const App = () => {
  const [weatherData, setWeatherData] = useState();
  const [unitSystem] = useState(config.unitSystem || "metric");

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("api/data");
      const data = await res.json();
      setWeatherData({ ...data });
    };
    getData();

    const interval = setInterval(getData, 3600000);
    return () => clearInterval(interval);
  }, []);

  return weatherData && !weatherData.message ? (
    <div className={styles.wrapper}>
      <MainCard
        city={weatherData.name}
        country={weatherData.sys.country}
        description={weatherData.weather[0].description}
        iconName={weatherData.weather[0].icon}
        unitSystem={unitSystem}
        weatherData={weatherData}
      />
      <ContentBox>
        <Header>
          <DateAndTime weatherData={weatherData} unitSystem={unitSystem} />
        </Header>
        <MetricsBox weatherData={weatherData} unitSystem={unitSystem} />
      </ContentBox>
    </div>
  ) : (
    <LoadingScreen loadingMessage="Loading data..." />
  );
};

export default App;
