import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { WebAuthentication } from '@/middlewares/web.middleware';
import ValidatorMiddleware from '@/middlewares/validator.middleware';
import DemoController from '@/controllers/demo.controller';

import * as DemoValidators from '@/controllers/validators/demo.controller.validation';

class OtpRoute implements Routes {
  public path = '/demo';
  public router = Router();
  public otpController = new DemoController();
  private webAuthenticate = new WebAuthentication();
  private validatorMiddleware = new ValidatorMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

  }
}

export default OtpRoute;
