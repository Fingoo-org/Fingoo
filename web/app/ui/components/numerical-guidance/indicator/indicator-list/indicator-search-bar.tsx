import { useSearchedIndicatorList } from '@/app/business/hooks/numerical-guidance/indicator/use-searched-indicator-list.hooks';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';

export default function IndicatorSearchBar() {
  const { searchTerm, setSearchTerm } = useSearchedIndicatorList();

  return <TinyInput placeholder="Search..." className="h-7 bg-fingoo-gray-1.5" defaultValue="" icon={SearchIcon} />;
}
