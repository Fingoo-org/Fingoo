import { Signal, Wifi, BatteryFull, Home, Users, Calendar, BarChart2, Menu } from 'lucide-react';

export default function MobileTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative box-border flex min-h-screen w-[375px] flex-col justify-between rounded-lg border-2 border-gray-300 bg-gray-200">
      {/* 상단 상태바 */}
      <div className="flex h-[60px] w-full text-black">
        <div className="flex h-full w-1/3 items-center justify-center text-black">9:41</div>
        <div className="flex h-full w-1/3 items-center">
          <div className="h-[37px] w-full rounded-[30px] bg-black"></div>
        </div>
        <div className="flex h-full w-1/3 items-center justify-center space-x-2 pr-2">
          <Signal size={18} />
          <Wifi size={18} />
          <BatteryFull size={18} />
        </div>
      </div>

      {/* 본문: 스크롤 가능하도록 조정 */}
      <div className="flex-grow overflow-y-auto">{children}</div>

      {/* 하단 네비게이션 */}
      <div className="sticky bottom-0 flex h-[60px] w-full items-center justify-between bg-white px-5 shadow-md">
        <div className="flex flex-col items-center space-y-1">
          <Home size={24} className="text-black" />
          <span className="text-xs text-black">홈</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Users size={24} className="text-teal-500" />
          <span className="text-xs text-teal-500">커뮤니티</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Calendar size={24} className="text-black" />
          <span className="text-xs text-black">캘린더</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <BarChart2 size={24} className="text-black" />
          <span className="text-xs text-black">지표</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Menu size={24} className="text-black" />
          <span className="text-xs text-black">더보기</span>
        </div>
      </div>
    </div>
  );
}
