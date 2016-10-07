import { createHash } from 'crypto';

export function hash(input) {
  const hash = createHash('sha1');
  hash.update(input || '');
  return hash.digest('hex');
}
