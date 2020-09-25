import { Form } from "mobx-react-form";
import dvr from "mobx-react-form/lib/validators/DVR";
import validatorjs from "validatorjs";

class FormsService extends Form {
  plugins() {
    return {
      dvr: dvr(validatorjs)
    };
  }
  options() {
    return {
      showErrorsOnReset: false
    }
  }
}

export default FormsService;