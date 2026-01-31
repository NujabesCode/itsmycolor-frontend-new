"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export const useQueryString = <T extends string | number | boolean | string[]>(
  key: string,
  defaultValue: T
) => {
  // React Hook은 항상 호출되어야 하므로 try-catch로 감쌀 수 없음
  // 대신 에러 발생 시 fallback 사용
  const router = useRouter();
  const pathnameFromRouter = usePathname();
  
  // window.location을 fallback으로 사용
  const [pathname, setPathname] = useState<string>(pathnameFromRouter || '');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // pathname이 없거나 변경되었을 때 window.location에서 가져오기
      if (!pathnameFromRouter) {
        setPathname(window.location.pathname);
      } else {
        setPathname(pathnameFromRouter);
      }
    } else {
      setPathname(pathnameFromRouter || '');
    }
  }, [pathnameFromRouter]);
  
  // 클라이언트 사이드에서 window.location.search를 직접 사용
  const [search, setSearch] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const searchRef = useRef<string>('');
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const initialSearch = window.location.search;
        setSearch(initialSearch);
        searchRef.current = initialSearch;
        
        // URL 변경 감지
        const handlePopState = () => {
          try {
            const currentSearch = window.location.search;
            setSearch(currentSearch);
            searchRef.current = currentSearch;
          } catch (e) {
            console.error('[useQueryString] popstate 에러:', e);
          }
        };
        
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
      } catch (e) {
        console.error('[useQueryString] 초기화 에러:', e);
      }
    }
  }, []);
  
  // window.location.search 변경 감지 (pushState/replaceState 후)
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    const checkUrlChange = () => {
      try {
        const currentSearch = window.location.search;
        if (currentSearch !== searchRef.current) {
          setSearch(currentSearch);
          searchRef.current = currentSearch;
        }
      } catch (e) {
        // 에러 무시
      }
    };
    
    // 짧은 간격으로 URL 변경 확인 (pushState/replaceState는 이벤트를 발생시키지 않으므로)
    const intervalId = setInterval(checkUrlChange, 50);
    
    return () => clearInterval(intervalId);
  }, [isClient]);
  
  const searchParams = useMemo(() => {
    try {
      return new URLSearchParams(search);
    } catch (e) {
      console.error('[useQueryString] URLSearchParams 생성 에러:', e);
      return new URLSearchParams();
    }
  }, [search]);

  // window.location.search를 직접 읽어서 value 계산 (항상 최신 값 사용)
  const value = useMemo(() => {
    if (!isClient) {
      return defaultValue;
    }
    
    try {
      // 항상 window.location.search를 직접 읽어서 최신 값 사용
      let currentSearchParams = searchParams;
      if (typeof window !== 'undefined') {
        try {
          const currentSearch = window.location.search;
          currentSearchParams = new URLSearchParams(currentSearch);
        } catch (e) {
          // 에러 무시하고 기존 searchParams 사용
        }
      }
      
      const result = (
        currentSearchParams.has(key)
          ? (() => {
              const param = currentSearchParams.get(key) ?? defaultValue;

              switch (typeof defaultValue) {
                case "number":
                  const numValue = parseInt(param as string);
                  if (isNaN(numValue)) {
                    console.warn(`[useQueryString] 숫자 파싱 실패: "${param}", 기본값 사용`);
                    return defaultValue;
                  }
                  return numValue;
                case "boolean":
                  return param === "true";
                case "object":
                  try {
                    return JSON.parse(param as string);
                  } catch (e) {
                    console.warn(`Failed to parse query param "${key}":`, param);
                    return defaultValue;
                  }
                default:
                  return param;
              }
            })()
          : defaultValue
      ) as T;
      
      // 디버깅: page 파라미터 변경 시 로그
      if (key === 'page' && typeof result === 'number') {
        console.log('[useQueryString] page 값:', { 
          key, 
          result, 
          searchParams: searchParams.toString(),
          windowSearch: typeof window !== 'undefined' ? window.location.search : 'N/A',
          windowPage: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('page') : 'N/A'
        });
      }
      
      return result;
    } catch (e) {
      console.error('[useQueryString] value 파싱 에러:', e);
      return defaultValue;
    }
  }, [key, defaultValue, searchParams, search, isClient]);
  
  // window.location.search 변경 감지를 위한 추가 useEffect
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    const checkUrlChange = () => {
      try {
        const currentSearch = window.location.search;
        if (currentSearch !== searchRef.current) {
          setSearch(currentSearch);
          searchRef.current = currentSearch;
        }
      } catch (e) {
        // 에러 무시
      }
    };
    
    // 짧은 간격으로 URL 변경 확인
    const intervalId = setInterval(checkUrlChange, 50);
    
    return () => clearInterval(intervalId);
  }, [isClient]);

  const setValue = useCallback(
    (value: T, prevParams?: URLSearchParams) => {
      try {
        // 항상 window.location.search에서 직접 읽어서 최신 쿼리 파라미터 유지
        let params: URLSearchParams;
        if (typeof window !== 'undefined') {
          // window.location.search에서 직접 읽기 (기존 파라미터 유지)
          params = new URLSearchParams(window.location.search);
        } else {
          params = new URLSearchParams(prevParams ?? searchParams);
        }

        switch (typeof value) {
          case "object":
            params.set(key, JSON.stringify(value));
            break;
          default:
            params.set(key, value.toString());
        }

        const newUrl = `${pathname || (typeof window !== 'undefined' ? window.location.pathname : '')}?${params}`;
        const newSearch = params.toString();
        const newSearchString = `?${newSearch}`;
        
        console.log('[useQueryString] setValue 호출:', { 
          key, 
          value, 
          newUrl, 
          newSearchString,
          currentSearch: typeof window !== 'undefined' ? window.location.search : 'N/A'
        });
        
        // 정적 export 모드에서는 window.location을 직접 사용
        if (typeof window !== 'undefined') {
          try {
            // 상태를 먼저 업데이트하여 즉시 반영
            setSearch(newSearchString);
            searchRef.current = newSearchString;
            
            // 그 다음 URL 변경 (페이지 리로드 방지)
            window.history.pushState({}, '', newUrl);
            
            // popstate 이벤트를 강제로 발생시켜 다른 리스너들이 감지하도록 함
            window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
            
            // URL이 제대로 업데이트되었는지 확인
            setTimeout(() => {
              const actualUrl = window.location.href;
              const actualSearch = window.location.search;
              console.log('[useQueryString] URL 업데이트 확인:', { 
                expected: newUrl, 
                actual: actualUrl,
                expectedSearch: newSearchString,
                actualSearch
              });
              if (actualSearch !== newSearchString) {
                console.warn('[useQueryString] URL이 예상과 다릅니다. 다시 시도합니다.');
                window.history.replaceState({}, '', newUrl);
                setSearch(newSearchString);
                searchRef.current = newSearchString;
              }
            }, 10);
          } catch (e) {
            console.error('[useQueryString] URL 변경 에러:', e);
            // Fallback: router 사용 (router가 있는 경우에만)
            if (router) {
              try {
                router.push(newUrl, { scroll: false });
                setSearch(newSearchString);
                searchRef.current = newSearchString;
                window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
              } catch (routerError) {
                console.error('[useQueryString] router.push 에러:', routerError);
              }
            }
          }
        }
        
        return params;
      } catch (e) {
        console.error('[useQueryString] setValue 에러:', e);
        return searchParams;
      }
    },
    [key, pathname, searchParams, router]
  );

  return [value, setValue] as const;
};
