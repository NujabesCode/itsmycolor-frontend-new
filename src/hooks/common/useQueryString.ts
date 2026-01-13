"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useQueryString = <T extends string | number | boolean | string[]>(
  key: string,
  defaultValue: T
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      return params;
    },
    [key, pathname, searchParams, router]
  );

  return [value, setValue] as const;
};
