import { Router } from 'express';
import DemoController from '@/controllers/demo.controller';

class InternalRoute {
  public path = '/api/v1/internal/';
  public router = Router();
  public demoController = new DemoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/demo/:id`, this.demoController.fetchDemoEntityAttributeInternal);
  }
}

export default InternalRoute;
