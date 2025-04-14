const express = require('express');
const promClient = require('prom-client');

const app = express();
const collectDefaultMetrics = promClient.collectDefaultMetrics;

// Collecte des métriques de base (mémoires, CPU, etc.)
collectDefaultMetrics();

// Exemple d'une métrique personnalisée
const counter = new promClient.Counter({
  name: 'angular_requests_total',
  help: 'Total number of requests to the Angular app',
});

// Endpoint pour exposer les métriques
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});

// Serveur sur le port 4200 (ou autre)
app.listen(4200, () => {
  console.log('Metrics server running at http://localhost:4200/metrics');
});
