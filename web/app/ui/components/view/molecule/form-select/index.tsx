import { FormSelectRoot } from './form-select-root';
import { FormSelectItem } from './form-select-item';

const FormSelect = Object.assign(FormSelectRoot, {
  Item: FormSelectItem,
});

export default FormSelect;
