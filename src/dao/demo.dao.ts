import demoModel from '@/models/demo.model';

class DemoDao {
  public getDemoEntity = async (requestBody) => {
    //TODO: Some demo entity code
    return await demoModel.find({ demo_param: requestBody.demo_param });
  }
}

export default DemoDao;
