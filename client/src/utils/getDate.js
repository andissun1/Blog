export const getDate = (date) => {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  return (
    new Date(date).getDate() +
    ' ' +
    months[new Date(date).getMonth()] +
    ' ' +
    new Date(date).getFullYear()
  );
};
