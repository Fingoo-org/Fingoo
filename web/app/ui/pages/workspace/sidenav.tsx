import IndicatorBoardToolbar from './indicator-board-toolbar';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-red-500">
      <div className="md:h-28 ">
        <SideNavHeader />
      </div>
      <div className="overflow-auto">
        <IndicatorBoardToolbar />
      </div>
    </div>
  );
}

function SideNavHeader() {
  return (
    <div className="flex h-full items-center bg-red-700 md:px-2">
      <div className="h-14 w-14 rounded-lg bg-gray-300 md:mx-8"></div>
      <div className="text-xl text-white">Logo</div>
    </div>
  );
}
