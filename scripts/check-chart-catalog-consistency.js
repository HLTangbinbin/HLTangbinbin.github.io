const fs = require('fs');
const path = require('path');

const workspaceRoot = process.cwd();
const registryPath = path.join(workspaceRoot, 'src/config/v3PageRegistry.js');
const catalogPath = path.join(workspaceRoot, 'src/config/chartCatalog.js');

const registrySource = fs.readFileSync(registryPath, 'utf8');
const catalogSource = fs.readFileSync(catalogPath, 'utf8');

const catalogKeys = new Set(
  Array.from(catalogSource.matchAll(/^\s*"([^"]+)":\s*\{/gm)).map((match) => match[1])
);

const referencedChartKeys = Array.from(
  registrySource.matchAll(/\b(?:chartRef|regionChartRef)\(\s*'([^']+)'/g)
).map((match) => match[1]);

const missingChartKeys = referencedChartKeys.filter((key) => !catalogKeys.has(key));

if (missingChartKeys.length) {
  console.error('Missing chartCatalog definitions for chart refs:');
  missingChartKeys.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

console.log(`chart_refs=${referencedChartKeys.length}`);
console.log(`chart_catalog_entries=${catalogKeys.size}`);
console.log('check-chart-catalog-consistency: OK');
