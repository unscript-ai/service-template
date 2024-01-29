import App from '@/app';
import { is_production, apm_service } from '@config';
import IndexRoute from '@routes/index.route';
import DemoRoute from '@/routes/demo.route';
import InternalRoute from './routes/internal.route';

if (is_production) {
  const apm = require('elastic-apm-node');
  apm.start({
    // Override service name from config.env.json
    serviceName: apm_service.name || 'demo_service',
    serverUrl: apm_service.url,
  });
}

const app = new App([
  new IndexRoute(), 
  new DemoRoute(), 
  new InternalRoute()
]);

app.listen();
