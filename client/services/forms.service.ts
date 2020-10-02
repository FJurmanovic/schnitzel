import { Form } from "mobx-react-form";
import dvr from "mobx-react-form/lib/validators/DVR";
import validatorjs from "validatorjs";

class FormsService extends Form {
  constructor(props) {
    super(props)
  }
  plugins() {
    return {
      dvr: dvr(validatorjs)
    };
  }
  options() {
    return {
      showErrorsOnReset: false,
      showErrorsOnInit: false,
      showErrorsOnClear: false,
      validateOnInit: false,
      validateOnBlur: false
    }
  }
}

export default FormsService;