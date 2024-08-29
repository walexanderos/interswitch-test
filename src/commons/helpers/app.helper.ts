import { IsNumber, IsOptional, Min } from 'class-validator';

export const isNumeric = (num: any) => (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && !isNaN(num as number);

export class Query {
  @IsOptional() pageIndex?: number;
  @IsOptional() pageSize?: number;
}

export const addMonthToDate = (date: Date, duration: number): string => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + duration);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}