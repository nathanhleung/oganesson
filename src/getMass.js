import ptable from './ptable';

export default function getMass(elements) {
  let sum = 0;
  const keys = Object.keys(elements);
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < ptable.length; j++) {
      if (ptable[j].symbol === keys[i]) {
        let atomicMass;
        let data = ptable[j].atomicMass;
        if (typeof data === 'string') {
          const parenthesis = data.indexOf('(');
          atomicMass = Number(data.substr(0, parenthesis - 1));
        } else if (Array.isArray(data)) {
          atomicMass = data[0];
        }
        sum += (elements[keys[i]] * atomicMass);
      }
    }
  }
  return Math.round(sum * 100) / 100;
}