import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';

export default function IndicatorSearchBar() {
  return <TinyInput placeholder="Search..." className="h-7 bg-fingoo-gray-1.5" defaultValue="" icon={SearchIcon} />;
}
