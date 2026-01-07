import { formatDistanceToNowStrict, differenceInSeconds } from 'date-fns';

export const formatRelativeTime = (dateString: string | undefined | null): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  try {
    const secondsDiff = differenceInSeconds(new Date(), date);
    if (secondsDiff < 60) {
      return 'Just now';
    }

    // Short format replacement
    return formatDistanceToNowStrict(date, { addSuffix: true })
        .replace(' seconds', 's')
        .replace(' second', 's')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' days', 'd')
        .replace(' day', 'd')
        .replace(' months', 'mo')
        .replace(' month', 'mo')
        .replace(' years', 'y')
        .replace(' year', 'y');

  } catch (error) {
    console.error("Date formatting error:", error);
    return '';
  }
};
