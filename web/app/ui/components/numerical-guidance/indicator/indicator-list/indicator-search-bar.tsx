import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';

export default function IndicatorSearchBar() {
  return <TinyInput defaultValue="" icon={SearchIcon} />;
}
