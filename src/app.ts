import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, is_production, session, sentry, apm_service, service_name, restartAlertName } from '@config';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import NotFoundError from '@exception/NotFoundError';
import { logger, stream } from '@utils/logger';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import { NextFunction, Request } from 'express-serve-static-core';
const zeus = require('zeus');

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public useSentry: boolean;
  public zeusLogger: any;
  private routes: Routes[];

  constructor(routes: Routes[]) {
    this.useSentry = !!sentry.dsn;

    if (this.useSentry) {
      Sentry.init({ dsn: sentry.dsn });
    }

    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.routes = routes;
    this.app = express();

    this.app.enable('trust proxy');
    this.initializeMiddlewares();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }
  }

  private initializeMiddlewares() {
    if (this.useSentry) {
      // The request handler must be the first middleware on the app
      this.app.use(Sentry.Handlers.requestHandler());
    }
    /**
     * Override the x-forwarded-proto header with custom x-forwarded-proto header if needed.
     * When node instance is behind an ALB, the x-forwarded-proto is overriden with an incorrect scheme,
     * x-wm-forwarded-proto is used to get the actual scheme value.
     */
    const validProto = ['http', 'https'];
    const CUSTOM_PROTO_KEY = 'x-wm-forwarded-proto';
    this.app.use((req, res, next) => {
      const proxiedProto = req.headers[CUSTOM_PROTO_KEY];
      if (typeof proxiedProto === 'string' && validProto.indexOf(proxiedProto.toLowerCase()) !== -1) {
        req.headers['x-forwarded-proto'] = proxiedProto;
      }
      next();
    });

    this.initializeRestartAlert();

    this.app.use(require('morgan')('dev'));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json({ limit: '10mb' }));

    this.connectToDatabase();
    this.initializeSendFormatToRes();
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.zeusLogger = zeus(this.app, service_name);

    this.initializeRoutes(this.routes);

    if (this.useSentry) {
      // The error handler must be before any other error middleware
      this.app.use(Sentry.Handlers.errorHandler());
    }

    //this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
    
    this.app.use((req: Request, res: any, next: NextFunction) => {
      const err = new NotFoundError(`API not Found: ${req.method} ${req.path}`);
      next(err);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeSendFormatToRes() {
    // add sendformat method to res
    this.app.use(function (req: Request, res: any, next: NextFunction) {
      res.sendformat = (data: any, code = 200) => {
        if (typeof data === 'object') return res.status(code).send({ code, ...data });
        else return res.status(code).send({ code, data: data });
      };
      next();
    });
  }

  private initializeRestartAlert() {
    require('sarthi').common.helpers.slack.sendServiceRestartAlert(`${__dirname}/..`, restartAlertName);
  }
}

export default App;
