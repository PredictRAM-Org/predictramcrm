import { format, getTime, setHours, setMinutes, setSeconds, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function epochToIST(epoch) {
  const milliseconds = epoch * 1000;
  const dateInIST = new Date(milliseconds);
  return dateInIST;
}

export function convetToMarketCloseTime(date) {
  return setSeconds(setMinutes(setHours(date || new Date(), 15), 30), 0);
}

export function convetToMarketOpenTime(date) {
  return setSeconds(setMinutes(setHours(date || new Date(), 9), 15), 0);
}
