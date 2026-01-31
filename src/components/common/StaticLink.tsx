'use client';

import { ReactNode, useMemo } from 'react';

/**
 * 정적 export 모드에서 경로를 자동으로 .html로 변환하는 Link 래퍼
 * trailingSlash: false일 때 /shopping -> /shopping.html로 변환
 * 쿼리 파라미터도 처리: /shopping?sort=latest -> /shopping.html?sort=latest
 */
export function StaticLink({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
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
      
      // _next 경로는 그대로 (정적 파일)
      if (href.includes('/_next/')) {
        return href;
      }
      
      // 쿼리 파라미터 분리
      const [path, query] = href.split('?');
      
      // 이미 .html로 끝나거나 파일 확장자가 있는 경우는 그대로
      if (path.endsWith('.html') || /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(path)) {
        return href;
      }
      
      // 동적 라우트도 .html 추가 (예: /shopping/product/[id] -> /shopping/product/[id].html)
      // 실제로는 [id]가 실제 ID로 치환된 상태이므로 .html만 추가하면 됨
      // 경로에 .html 추가하고 쿼리 파라미터는 유지
      // /shopping/product/123 -> /shopping/product/123.html
      // /shopping?sort=latest -> /shopping.html?sort=latest
      const result = query ? `${path}.html?${query}` : `${path}.html`;
      // 디버깅: 상품 상세 페이지 링크 확인
      if (path.includes('/shopping/product/')) {
        console.log('[StaticLink] 상품 상세 페이지 링크:', { original: href, transformed: result });
      }
      return result;
    }
    return href;
  }, [href]);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 기본 클릭 핸들러가 있으면 실행
    if (props.onClick) {
      props.onClick(e);
      // preventDefault가 호출되었으면 링크 이동을 막음
      if (e.defaultPrevented) {
        return;
      }
    }
    
    // 상품 상세 페이지 링크인 경우 dummy.html로 리다이렉트하고 쿼리 파라미터로 ID 전달
    // S3에서 dummy.html 파일이 존재하므로 404가 발생하지 않음
    if (transformedHref.includes('/shopping/product/')) {
      e.preventDefault();
      const urlMatch = transformedHref.match(/\/shopping\/product\/([^\/\?\#]+)/);
      if (urlMatch && urlMatch[1]) {
        const productId = urlMatch[1].replace(/\.html$/, '');
        if (productId && productId !== 'dummy') {
          console.log('[StaticLink] 상품 상세 페이지로 이동 (dummy.html 사용):', productId);
          // dummy.html로 이동하고 쿼리 파라미터로 상품 ID 전달
          window.location.href = `/shopping/product/dummy.html?productId=${productId}`;
          return;
        }
      }
    }
    
    // 일반 링크는 기본 동작 사용
  };

  return (
    <a 
      href={transformedHref} 
      {...props}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
