export const ROUTINE = {
  id: 'craig-ppl-v1',
  barbellWeightLb: 45,
  platesLb: [45, 35, 25, 10, 5, 2.5, 1.25],
  cycle: ['pull', 'push', 'legs'],
  days: {
    pull: [
      { exercise: 'row', name: 'Barbell Row', scheme: '3x5', kind: 'barbell', seedWeightLb: 130, successStepLb: 5 },
      { exercise: 'deadlift', name: 'Deadlift', scheme: '3x5', kind: 'barbell', seedWeightLb: 200, successStepLb: 5 },
      { exercise: 'lat_pulldown', name: 'Lat Pulldown', scheme: '3x8+', kind: 'machine', seedWeightLb: 85, repRange: [8, 12] },
      { exercise: 'hammer_curl', name: 'Hammer Curl', scheme: '2x8+', kind: 'dumbbell', seedWeightLb: 25, repRange: [8, 12] },
      { exercise: 'tricep_extension', name: 'Tricep Extension', scheme: '2x8+', kind: 'machine', seedWeightLb: 40, repRange: [8, 12] }
    ],
    push: [
      { exercise: 'bench', name: 'Bench Press', scheme: '3x5', kind: 'barbell', seedWeightLb: 127.5, successStepLb: 2.5 },
      { exercise: 'incline_db_bench', name: 'Incline Dumbbell Bench', scheme: '3x8+', kind: 'dumbbell', seedWeightLb: 32.5, repRange: [8, 12] },
      { exercise: 'lateral_raise', name: 'Lateral Raise', scheme: '3x8+', kind: 'dumbbell', seedWeightLb: 10, repRange: [8, 12] }
    ],
    legs: [
      { exercise: 'squat', name: 'Back Squat', scheme: '3x5', kind: 'barbell', seedWeightLb: 170, successStepLb: 5 },
      { exercise: 'rdl', name: 'Romanian Deadlift', scheme: '3x5', kind: 'barbell', seedWeightLb: 170, successStepLb: 5 },
      { exercise: 'leg_curl', name: 'Leg Curl', scheme: '3x8+', kind: 'machine', seedWeightLb: 68, repRange: [8, 12] }
    ]
  }
};

export const exerciseById = (id) => Object.values(ROUTINE.days).flat().find((item) => item.exercise === id);
export const setsFor = (scheme) => Number(scheme.match(/^\d+/)?.[0] || 0);
export const targetFor = (scheme) => Number(scheme.match(/x(\d+)/)?.[1] || 0);
export const formatWeight = (weight) => `${Number(weight).toFixed(Number(weight) % 1 ? 2 : 0).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')} lb`;
export const dateKey = (date) => {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
};
export const isTrainingDay = (date) => ![0, 6].includes(new Date(`${dateKey(date)}T12:00:00`).getDay());
export const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export function plateLoad(weight) {
  const perSide = (Number(weight) - ROUTINE.barbellWeightLb) / 2;
  if (perSide < 0 || Math.round(perSide * 4) !== perSide * 4) return { exact: false, perSide };
  let remaining = perSide;
  const plates = [];
  for (const plate of ROUTINE.platesLb) {
    while (remaining + 0.001 >= plate) { plates.push(plate); remaining = Math.round((remaining - plate) * 100) / 100; }
  }
  return { exact: Math.abs(remaining) < 0.001, perSide, plates };
}

export function nearestLoadable(weight) {
  let best = ROUTINE.barbellWeightLb;
  let distance = Infinity;
  for (let candidate = ROUTINE.barbellWeightLb; candidate <= 600; candidate += 2.5) {
    if (plateLoad(candidate).exact && Math.abs(candidate - weight) < distance) { best = candidate; distance = Math.abs(candidate - weight); }
  }
  return best;
}

export function scheduledDay(date, workouts) {
  if (!isTrainingDay(date)) return null;
  const prior = workouts.filter((workout) => workout.date && workout.date < dateKey(date)).sort((a, b) => a.date.localeCompare(b.date));
  if (prior.length) return ROUTINE.cycle[(ROUTINE.cycle.indexOf(prior.at(-1).day) + 1) % ROUTINE.cycle.length];
  return ROUTINE.cycle[0];
}

export function recommendation(exercise, workouts) {
  const config = exerciseById(exercise);
  if (!config) return null;
  const history = workouts.filter((workout) => workout.date && workout.lifts?.[exercise]).sort((a, b) => a.date.localeCompare(b.date));
  const latest = history.at(-1)?.lifts[exercise];
  if (!latest || !['done', 'failed'].includes(latest.status)) return { weight: config.seedWeightLb, reason: 'routine starting point' };
  const note = (latest.note || '').toLowerCase();
  const explicit = note.match(/(?:go up to|try again at|next)\s*(\d+(?:\.\d+)?)/) || note.match(/(\d+(?:\.\d+)?)\s*(?:lb\s*)?next/);
  if (explicit) return { weight: Number(explicit[1]), reason: 'your last note' };
  if (latest.status === 'failed') return { weight: latest.weightLb, reason: 'repeat after a miss' };
  if (config.successStepLb && latest.reps?.length && latest.reps.every((rep) => rep >= targetFor(config.scheme))) return { weight: latest.weightLb + config.successStepLb, reason: 'last session completed' };
  if (config.repRange && latest.reps?.length && latest.reps.every((rep) => rep >= config.repRange[1])) return { weight: latest.weightLb + (config.kind === 'dumbbell' ? 2.5 : 5), reason: 'top of rep range' };
  return { weight: latest.weightLb, reason: latest.reps?.length ? 'repeat last working weight' : 'last recorded working weight' };
}
