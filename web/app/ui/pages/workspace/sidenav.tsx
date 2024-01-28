import IndicatorBoardToolbar from './indicator-board-toolbar';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-red-500">
      <div className="md:h-28 ">
        <SideNavHeader />
      </div>
      <div className="md:h-2/5 overflow-auto">
        <IndicatorBoardToolbar />
      </div>
    </div>
  );
}

function SideNavHeader() {
  return (
    <div className="flex items-center h-full md:px-2 bg-red-700">
      <div className="w-14 h-14 bg-gray-300 rounded-lg md:mx-8"></div>
      <div className="text-white text-xl">Logo</div>
    </div>
  );
}
