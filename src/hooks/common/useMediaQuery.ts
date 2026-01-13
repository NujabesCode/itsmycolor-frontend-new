"use client";

import { useState, useEffect } from "react";

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // 초기 상태 설정
    setMatches(media.matches);

    // 변경 이벤트 리스너 설정
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    // 클린업 함수
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};
