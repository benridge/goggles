import moment from 'moment';

export function formatDateString(dateString) {
  const date = moment(new Date(dateString));
  return date.calendar();
}

export function formatTodayDate(dateString) {
  const date = moment(new Date(dateString));
  return date.format('h:mm A');
}