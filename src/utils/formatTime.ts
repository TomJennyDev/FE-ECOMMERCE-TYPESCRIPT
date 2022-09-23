import { format, formatDistanceToNow, getTime } from "date-fns";

export function fDate(date: string | Date | number) {
  return format(new Date(date), "dd MMMM yyyy");
}

export function fDateTime(date: string) {
  return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function fTimestamp(date: string) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: string) {
  return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function fToNow(date: string) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function addDays(date: string | Date, days: number) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return fDate(result);
}

export function getArrayLastDays(
  numberOfDay: number,
  format: boolean = true,
  date: string
) {
  const offset_date = date ? new Date(date) : new Date();
  const arrLast7Days = Array.from(Array(numberOfDay).keys()).map(() => {
    let date: string | number = offset_date.setDate(offset_date.getDate() - 1);
    date = format ? fDate(date) : date;
    return date;
  });
  return arrLast7Days;
}

export const setDateMDY = (dteSTR: string) => {
  let [d, m, y] = dteSTR.split("-");
  return new Date(`${m} ${d}, ${y} 00:00:00`);
};
