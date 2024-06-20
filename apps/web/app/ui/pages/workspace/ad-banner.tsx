import { LogClick } from '@/app/logging/component/log-click';
import { useResponsive } from '@/app/utils/hooks/use-responsive.hook';
import Link from 'next/link';
import Image from 'next/image';
import AdBannerImage1 from '@/public/assets/images/ad_banner_1.png';
import AdBannerImage2 from '@/public/assets/images/ad_banner_2.png';

export default function AdBanner() {
  const { isBigScreen } = useResponsive();

  return (
    <LogClick event={'click_ad_banner'}>
      <Link target={'_blank'} href="https://www.yes24.com/Product/Goods/126705369">
        {isBigScreen ? <Image src={AdBannerImage1} alt="광고 배너" /> : <Image src={AdBannerImage2} alt="광고 배너" />}
      </Link>
    </LogClick>
  );
}
