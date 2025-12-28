import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';

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
      <p>@andissun</p>

      <div>
        <p>{city},</p>
        <p>{new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })},</p>
        <p>{temp}℃</p>
        {/* <p>{descripWeather}</p> */}
      </div>
    </footer>
  );
}

// ----- Стили -----
export const Footer = styled(FooterContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  padding-inline: 156px;
  background-color: ${colors.main};

  font-size: 14px;
  font-weight: 600;
  color: white;
  family: Monserrat;

  & > div {
    display: flex;
    gap: 5px;
    padding-inline: 20px;
  }

  @media (max-width: 1200px) {
    padding: 10px 20px;
    height: 30px;
  }
`;
