import { format, differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export function calculateAge(acquisitionDateStr: string): string {
  const date = parseISO(acquisitionDateStr);
  const now = new Date();
  
  const years = differenceInYears(now, date);
  const months = differenceInMonths(now, date) % 12;
  
  if (years > 0) {
    return `${years} yr${years !== 1 ? 's' : ''} ${months} mo${months !== 1 ? 's' : ''}`;
  }
  return `${months} mo${months !== 1 ? 's' : ''}`;
}

export function formatDateTime(isoString: string): string {
  return format(parseISO(isoString), 'MMM d, yyyy h:mm a');
}

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'MMM d, yyyy');
}
