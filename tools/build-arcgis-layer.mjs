// Gera a camada para ArcGIS Online a partir do floodwatch.json do Floods (IAS por freguesia).
// Saídas: arcgis/ias-freguesias.csv (juntar à CAOP/freguesias por dtmnfr) e arcgis/ias-freguesias-pontos.geojson (pontos, uso direto).
// Uso: node tools/build-arcgis-layer.mjs floodwatch.json parishes.geojson [pasta_saida]
import fs from 'node:fs';
const [fwp, pp, outDir = 'arcgis'] = process.argv.slice(2);
const w = JSON.parse(fs.readFileSync(fwp, 'utf8'));
if (w.schema_version !== 'floods-watch/1') throw new Error('esquema inesperado: ' + w.schema_version);
const NOMES = w.method.classes, COR = ['#9aa9ad', '#4fae7b', '#e3c941', '#ee9b3d', '#d9503f', '#8e2f78'];
const ageH = (Date.now() - Date.parse(w.computed_at)) / 36e5, stale = ageH > (w.valid_for_hours ?? 3);
const par = JSON.parse(fs.readFileSync(pp, 'utf8')).features;
const bb = g => { let a = 1e9, b = -1e9, c = 1e9, d = -1e9; const f = cs => { if (typeof cs[0] === 'number') { a = Math.min(a, cs[0]); b = Math.max(b, cs[0]); c = Math.min(c, cs[1]); d = Math.max(d, cs[1]); } else cs.forEach(f); }; f(g.coordinates); return [(a + b) / 2, (c + d) / 2]; };
const rows = [], pts = [];
for (const f of par) {
  const k = f.properties.dtmnfr, p = w.parishes[k]; if (!p || !f.geometry) continue;
  const a = stale ? 0 : (p.a ?? 0);   // regra do Floods: dados com mais de valid_for_hours não ativam cores
  const r = { dtmnfr: k, freguesia: f.properties.freguesia, municipio: f.properties.municipio, classe_ias: a, classe_nome: stale ? 'Sem dados (desatualizado)' : NOMES[a], cor_hex: COR[a],
    estrutural_1_5: p.s ?? null, ativacao_1_4: p.t ?? null, computed_at: w.computed_at, idade_horas: +ageH.toFixed(1), desatualizado: stale ? 'sim' : 'não', estado: 'EXPERIMENTAL — NÃO OPERACIONAL' };
  rows.push(r); pts.push({ type: 'Feature', properties: r, geometry: { type: 'Point', coordinates: bb(f.geometry) } });
}
fs.mkdirSync(outDir, { recursive: true });
const cols = Object.keys(rows[0]), q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
fs.writeFileSync(`${outDir}/ias-freguesias.csv`, [cols.join(','), ...rows.map(r => cols.map(c => q(r[c])).join(','))].join('\n'));
fs.writeFileSync(`${outDir}/ias-freguesias-pontos.geojson`, JSON.stringify({ type: 'FeatureCollection', features: pts }));
console.log(rows.length, 'freguesias; idade', ageH.toFixed(1), 'h;', stale ? 'DESATUALIZADO' : 'ok');
