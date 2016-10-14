export default function (...path) {
  return ['root'].concat(...path).map(
    dname => dname
      .replace(/\&/g, '&amp;')
      .replace(/\./g, '&dot;')
      .replace(/\:/g, '&col;')
  )
  .join('.');
}
