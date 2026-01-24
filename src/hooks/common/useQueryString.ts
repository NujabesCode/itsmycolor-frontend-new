"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export const useQueryString = <T extends string | number | boolean | string[]>(
  key: string,
  defaultValue: T
) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // 클라이언트 사이드에서 window.location.search를 직접 사용
  const [search, setSearch] = useState<string>('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search);
      
      // URL 변경 감지
      const handlePopState = () => {
        setSearch(window.location.search);
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);
  
  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const value = (
    searchParams.has(key)
      ? (() => {
          const param = searchParams.get(key) ?? defaultValue;

          switch (typeof defaultValue) {
            case "number":
              return parseInt(param as string);
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

  const setValue = useCallback(
    (value: T, prevParams?: URLSearchParams) => {
      const params = new URLSearchParams(prevParams ?? searchParams);

      switch (typeof value) {
        case "object":
          params.set(key, JSON.stringify(value));
          break;
        default:
          params.set(key, value.toString());
      }

      router.push(`${pathname}?${params}`, { scroll: false });
      // URL 변경 후 search 상태 업데이트
      if (typeof window !== 'undefined') {
        setSearch(window.location.search);
      }
      return params;
    },
    [key, pathname, searchParams, router]
  );

  return [value, setValue] as const;
};
