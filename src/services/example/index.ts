import { ServiceReponse } from "../../config/constants";
import { Example as ExampleModel } from "../../models/example";

class Example {
  private _foo = "foo";

  constructor() {
    //
  }

  get foo() {
    return this._foo;
  }

  set foo(val: string) {
    this._foo = val;
  }

  /**
   *
   * @param title Title of Example Entity
   */
  public async save(title: string) {
    let result: ServiceReponse<ExampleModel>;

    try {
      const example = new ExampleModel();
      result = { success: true, data: example };
    } catch (error) {
      result = { success: true };
    }

    return result;
  }
}

const exampleService = new Example();

export { exampleService };
