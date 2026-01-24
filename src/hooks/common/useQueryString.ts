"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQueryString = <T extends string | number | boolean | string[]>(
  key: string,
  defaultValue: T
) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // 클라이언트 사이드에서만 searchParams 사용
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 마운트 전에는 빈 URLSearchParams 사용
  const safeSearchParams = mounted ? searchParams : new URLSearchParams();

  const value = (
    safeSearchParams.has(key)
      ? (() => {
          const param = safeSearchParams.get(key) ?? defaultValue;

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
      const params = new URLSearchParams(prevParams ?? safeSearchParams);

      switch (typeof value) {
        case "object":
          params.set(key, JSON.stringify(value));
          break;
        default:
          params.set(key, value.toString());
      }

      router.push(`${pathname}?${params}`, { scroll: false });
      return params;
    },
    [key, pathname, safeSearchParams, router]
  );

  return [value, setValue] as const;
};
