import DemoDao from "@/dao/demo.dao";

class DemoService {
  private demoDao = new DemoDao();

  /**
   * Describe your service method briefly, what it does
   * @param {Object} requestBody 
   */
  public fetchDemoEntity = (requestBody) => {
    // Your method specific logic here
  }
}

export default DemoService;
