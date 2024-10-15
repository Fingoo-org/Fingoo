'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './breadcrumb';

export default function BlogBreadcrumb() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">FINGOO</BreadcrumbLink>
        </BreadcrumbItem>
        {pathname.startsWith('/blog') ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">BLOG</BreadcrumbLink>
            </BreadcrumbItem>
            {pathname.split('/').length > 2 ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>POST</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
