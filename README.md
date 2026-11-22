# IGNISPYRO Floods · Susceptibility (independente)

**EXPERIMENTAL — NÃO OPERACIONAL.** Plataforma independente que mostra o IAS do Floods (verde/amarelo/laranja/vermelho/roxo por freguesia), permite carregar pacotes ZIP do Copernicus EMS e ver a cheia observada no mapa (`zip-map.html`) e publica uma camada para ArcGIS Online (`arcgis/`). Só lê dados públicos do Floods; não escreve nele nem no QNAP.

- Plataforma: `index.html` · Mapa ZIP: `zip-map.html` · ArcGIS: `arcgis/README.html`
- Camada IA: reservada; só será ativada com modelo validado (ver `ignispyro-floods`, branch `feature/floods-ai-research`, `docs/FLOODS_AI_EVALUATION.md`).
- O site é reconstruído de 30 em 30 min (`.github/workflows/pages.yml`) com o `floodwatch.json` público do Floods. Se este estiver desatualizado (>3 h) a camada marca «Sem dados».
