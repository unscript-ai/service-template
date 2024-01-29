import { NextFunction, Response, Request } from 'express';

//services
import DemoService from '@services/demo.service';

//DTOS
import { GetDemoEntityRequestQuery } from './typings/demo.controller';

class DemoController {
  public demoService = new DemoService();

  /**
   * Given the query/body/argument X, {functionName} fetches a demo entity
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @returns 
   */
  public getDemoEntity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestQuery: GetDemoEntityRequestQuery = req.query;
    const responseBody = this.demoService.fetchDemoEntity(requestQuery);
    return res.sendformat({ data: responseBody });
  };

  /**
   * All internal apis should have Internal appended to the end for quick debugging
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @returns 
   */
  public fetchDemoEntityAttributeInternal = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Some implementation
  }
}

export default DemoController;
