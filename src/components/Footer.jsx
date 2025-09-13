import { useEffect, useState } from 'react';
import styled from 'styled-components';

// ----- Стили -----
export const Footer = styled(FooterContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120px;
  padding: 20px 40px;
  background-color: white;
  box-shadow: 0 2px 12px black;
  font-weight: bold;
`;

// ----- Компонент ------
function FooterContainer({ className }) {
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState('');
  const [descripWeather, setDescripWeather] = useState('');

  useEffect(() => {
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?q=Moscow&lang=ru&units=metric&appid=15249c1049324c36f8dfce1ec69bb3a6'
    )
      .then((res) => res.json())
      .then(({ name, main, weather }) => {
        setCity(name);
        setTemp(Math.round(main.temp));
        setDescripWeather(weather[0].description);
      });
  }, []);

  return (
    <footer className={className}>
      <div>
        <p>Блог веб-разработчика</p>
        <p>web@developer.ru</p>
      </div>

      <div>
        <p>
          {city}, {new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })}
        </p>
        <p>
          {temp} градусов, {descripWeather}
        </p>
      </div>
    </footer>
  );
}
