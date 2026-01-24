'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode, useMemo } from 'react';

/**
 * 정적 export 모드에서 경로를 자동으로 .html로 변환하는 Link 래퍼
 * trailingSlash: false일 때 /shopping -> /shopping.html로 변환
 */
export function StaticExportLink({
  href,
  children,
  ...props
}: LinkProps & { children: ReactNode }) {
  // href가 문자열인 경우 처리
  const transformedHref = useMemo(() => {
    if (typeof href === 'string') {
      // 외부 링크나 해시는 그대로
      if (href.startsWith('http') || href.startsWith('#')) {
        return href;
      }
      
      // 메인 페이지는 그대로
      if (href === '/' || href === '/index.html') {
        return '/';
      }
      
      // 동적 라우트나 _next 경로는 그대로
      if (href.includes('[') || href.includes(']') || href.includes('/_next/')) {
        return href;
      }
      
      // 쿼리 파라미터 분리
      const [path, query] = href.split('?');
      
      // 이미 .html로 끝나거나 파일 확장자가 있는 경우는 그대로
      if (path.endsWith('.html') || /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(path)) {
        return href;
      }
      
      // 경로에 .html 추가하고 쿼리 파라미터는 유지
      // /shopping?sort=latest -> /shopping.html?sort=latest
      return query ? `${path}.html?${query}` : `${path}.html`;
    }
    return href;
  }, [href]);
  
  return (
    <Link href={transformedHref} {...props}>
      {children}
    </Link>
  );
}
