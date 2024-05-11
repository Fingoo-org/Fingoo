import { useSearchedIndicatorList } from '@/app/business/hooks/numerical-guidance/indicator/use-searched-indicator-list.hooks';
import TinyInput from '../../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';

export default function IndicatorSearchBar() {
  const { searchTerm, setSearchTerm } = useSearchedIndicatorList();

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <TinyInput
      onValueChange={handleSearchTermChange}
      placeholder="Search..."
      className="h-7 bg-fingoo-gray-1.5"
      defaultValue={searchTerm}
      icon={SearchIcon}
    />
  );
}
