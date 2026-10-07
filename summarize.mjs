// node summarize.mjs  -> recomputes the summary table from runs.jsonl
import fs from 'node:fs';
const L = fs.readFileSync(new URL('./runs.jsonl', import.meta.url), 'utf8').trim().split('\n').map(JSON.parse);
const by = {}; for (const r of L) (by[r.route.route_id] ??= []).push(r);
console.log('route | model | n | correct_end_state | task_success | runs_with_duplicates | false_success | cost_usd');
for (const [k, a] of Object.entries(by).sort()) {
  const o = a.map(r => r.outcome); const n = f => o.filter(f).length;
  console.log([k, a[0].route.model, a.length, n(x => x.state_ok), n(x => x.task_success), n(x => x.duplicates > 0), n(x => x.false_success), a.reduce((t, r) => t + (r.cost_usd || 0), 0).toFixed(4)].join(' | '));
}
