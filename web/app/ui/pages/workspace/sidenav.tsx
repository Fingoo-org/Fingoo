import IndicatorBoardToolbar from './indicator-board-toolbar';

export default function SideNav() {
  return (
    <div className="grid h-full grid-rows-[1fr_5fr_4fr] flex-col bg-white">
      <div>
        <SideNavHeader />
      </div>
      <div>
        <IndicatorBoardToolbar />
      </div>
      <div className="h-full bg-red-500"></div>
    </div>
  );
}

function SideNavHeader() {
  return (
    <div className="flex h-full items-center md:px-2">
      <div className="h-14 w-14 rounded-lg bg-gray-300 md:mx-8"></div>
      <div className="text-xl">Fingoo</div>
    </div>
  );
}
