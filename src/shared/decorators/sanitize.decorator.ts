import { Transform } from 'class-transformer';
import { filterXSS } from 'xss';

export function Sanitize() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return filterXSS(value.trim());
    }
    return value;
  });
}