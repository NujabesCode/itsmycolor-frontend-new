'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  IoIosMenu,
  IoIosSearch,
  IoIosHeart,
  IoIosArrowDown,
  IoIosNotifications,
} from 'react-icons/io';
import { IoClose, IoPersonOutline, IoBagOutline, IoHeartOutline } from 'react-icons/io5';
import { ROUTE } from '@/configs/constant/route';
import { useGetUser } from '@/serivces/user/query';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import { BodyType } from '@/serivces/user/type';
import { ColorSeason } from '@/serivces/color-analysis/type';
import { ClothingCategory } from '@/serivces/product/clothing-category';
import { useProductStore } from '@/providers/ProductStoreProvider';
import { useGetMyNotifications } from '@/serivces/notification/query';
import { notificationApi } from '@/serivces/notification/request';
import { Notification } from '@/serivces/notification/type';

const MENU_CATEGORIES = [
  {
    name: 'SHOP',
    path: ROUTE.SHOPPING,
  },
  {
    name: 'BEST',
    path: `${ROUTE.SHOPPING}?sort=sales`,
  },
  {
    name: 'NEW',
    path: `${ROUTE.SHOPPING}?sort=latest`,
  },
  {
    name: '의류',
    path: ROUTE.SHOPPING,
    subItems: Object.values(ClothingCategory).map((category) => ({
      name: category,
      path: `${ROUTE.SHOPPING}?clothingCategory=${encodeURIComponent(category)}`,
      color: 'text-gray-700',
    })),
  },
  {
    name: '퍼스널 컬러',
    path: ROUTE.SHOPPING,
    subItems: Object.values(ColorSeason).map((season) => ({
      name: season,
      path: `${ROUTE.SHOPPING}?colorSeasons=${encodeURIComponent(JSON.stringify([season]))}`,
      color: season.includes('Spring')
        ? 'text-pink-600'
        : season.includes('Summer')
        ? 'text-blue-600'
        : season.includes('Autumn')
        ? 'text-orange-600'
        : 'text-purple-600',
    })),
  },
  {
    name: '체형별',
    path: ROUTE.SHOPPING,
    subItems: Object.values(BodyType).map((type) => ({
      name: type,
      path: `${ROUTE.SHOPPING}?bodyType=${type}`,
      color: 'text-gray-700',
    })),
  },
  {
    name: '진단',
    path: ROUTE.TYPETEST,
    subItems: [
      { name: '체형 진단', path: ROUTE.TYPETEST, color: 'text-gray-700' },
      { name: '컬러 진단', path: ROUTE.COLOR_TEST, color: 'text-gray-700' },
    ],
  },
  {
    name: '컨설팅',
    path: 'https://booking.naver.com/booking/6/bizes/703026',
  },
];

export const BuyerHeader = () => {
  const [{ data: user },,{ data: brand }] = useGetUser();
  const hasBrand = !!brand;
  
  const router = useRouter();
  const { logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const cartProducts = useProductStore((state) => state.cartProducts);
  const { data: notifications = [], refetch: refetchNotifications } = useGetMyNotifications();

  const [search, setSearch] = useState('');

  const onSearch = () => {
    if (search.trim()) {
      router.push(`${ROUTE.SHOPPING}?search=${encodeURIComponent(search.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isNotificationOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-notification-dropdown]') && !target.closest('[data-notification-button]')) {
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const isLoggedIn = mounted && !!user;

  const onLogout = () => {
    logout();
    alert('로그아웃에 성공했습니다.');
    router.replace(ROUTE.MAIN);
    router.refresh();
  };

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    setIsNotificationOpen(false);
    
    // 읽지 않은 알림인 경우 읽음 처리
    if (!notification.isRead) {
      try {
        await notificationApi.markNotificationAsRead(notification.id);
        refetchNotifications();
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Top Notice Bar */}
      <div className="hidden lg:block bg-gray-900 text-white text-xs py-2.5 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-center gap-6 whitespace-nowrap animate-scroll">
            <span>✨ 퍼스널 컬러에 맞는 스타일을 찾아드립니다</span>
            <span className="text-gray-500">•</span>
            <span>🎨 전문가의 정확한 컬러 진단 서비스</span>
            <span className="text-gray-500">•</span>
            <span>👗 체형별 맞춤 스타일링 추천</span>
            <span className="text-gray-500">•</span>
            <span>🚚 5만원 이상 구매 시 무료 배송</span>
            <span className="text-gray-500">•</span>
            <span>💬 1:1 퍼스널 컬러 컨설팅 예약 가능</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-3 py-3 gap-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1.5 shrink-0">
              <IoIosMenu size={20} />
            </button>

            <Link href={ROUTE.MAIN} className="flex items-center flex-1 min-w-0 justify-center">
              <Image
                src="/image/itsmycolor-logo.png"
                alt="It&apos;s my color"
                width={140}
                height={38}
                priority
                className="h-8 w-auto max-w-full"
                sizes="140px"
              />
            </Link>

            <div className="flex items-center gap-1 shrink-0">
              <button className="p-1.5" onClick={toggleMobileSearch}>
                <IoIosSearch size={20} />
              </button>
              {isLoggedIn && (
                <button
                  className="p-1.5 relative"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  data-notification-button
                >
                  <IoIosNotifications 
                    size={20} 
                    className={unreadCount > 0 ? "text-black" : "text-gray-400"}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
              <Link href={ROUTE.MYPAGE_CART_PRODUCT} className="p-1.5 relative">
                <IoBagOutline size={20} className="text-gray-700" />
                {cartProducts.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartProducts.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-200 overflow-x-auto scrollbar-hide">
          <ul className="flex items-center gap-6 px-4 py-3 whitespace-nowrap">
            {MENU_CATEGORIES.map((category) => (
              <li key={category.name} className="shrink-0">
                <Link
                  href={category.path || '#'}
                  className="text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="max-w-[1440px] mx-auto px-6">
            {/* Single Row: 로고, 카테고리, 검색, 마이쇼핑, 로그인 */}
            <div className="flex items-center justify-between h-16">
              {/* Left: 햄버거바 + Logo + 카테고리 메뉴 */}
              <div className="flex items-center gap-4 shrink-0">
                {/* 햄버거바 버튼 */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="메뉴 열기"
                >
                  <IoIosMenu size={24} className="text-gray-700" />
                </button>

                {/* Logo */}
                <Link href={ROUTE.MAIN} className="flex items-center shrink-0">
                  <Image
                    src="/image/itsmycolor-logo.png"
                    alt="It&apos;s my color"
                    width={140}
                    height={40}
                    priority
                    className="h-9 w-auto"
                  />
                </Link>

                {/* 카테고리 메뉴 */}
                <div className="flex items-center gap-6">
                  {MENU_CATEGORIES.map((category) => (
                    <div
                      key={category.name}
                      className="relative group"
                      onMouseEnter={() =>
                        category.subItems && setActiveCategory(category.name)
                      }
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <Link
                        href={category.path || '#'}
                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                      >
                        {category.name}
                        {category.subItems && (
                          <IoIosArrowDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              activeCategory === category.name ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </Link>

                    {/* Dropdown */}
                    {category.subItems && (
                      <div
                        className={`absolute top-full left-0 mt-2 bg-white shadow-2xl min-w-[280px] transition-all duration-200 border border-gray-100 z-50 ${
                          activeCategory === category.name
                            ? 'opacity-100 visible transform translate-y-0'
                            : 'opacity-0 invisible transform -translate-y-2'
                        }`}
                      >
                        <div className="p-6">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            {category.name === '퍼스널 컬러'
                              ? '퍼스널 컬러별 쇼핑'
                              : category.name === '체형별'
                              ? '체형별 쇼핑'
                              : category.name}
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {category.subItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.path}
                                className={`block px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group ${
                                  item.color || 'text-gray-700'
                                }`}
                              >
                                <span className="text-sm font-medium group-hover:translate-x-1 inline-block transition-transform">
                                  {item.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <Link
                              href={category.path}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              전체 보기
                              <IoIosArrowDown
                                size={14}
                                className="-rotate-90"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                </div>
              </div>

              {/* Center: 검색 */}
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="키워드 / 해시태그"
                    className="w-full h-9 pl-9 pr-9 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-gray-400 focus:outline-none transition-all text-sm placeholder:text-gray-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <IoIosSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    size={18}
                    onClick={onSearch}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <IoClose size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right: 마이쇼핑, 로그인/회원가입, 아이콘 */}
              <div className="flex items-center gap-5 shrink-0">
                {isLoggedIn ? (
                  <Link
                    href={ROUTE.MYPAGE}
                    className="text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    마이쇼핑
                  </Link>
                ) : null}
                {!isLoggedIn ? (
                  <>
                    <Link
                      href={ROUTE.SIGNIN}
                      className="text-sm text-gray-700 hover:text-black transition-colors"
                    >
                      로그인
                    </Link>
                    <Link
                      href={ROUTE.SIGNUP}
                      className="text-sm text-gray-700 hover:text-black transition-colors"
                    >
                      회원가입
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onLogout}
                      className="text-sm text-gray-700 hover:text-black transition-colors"
                    >
                      로그아웃
                    </button>
                    {isLoggedIn && (
                      <div className="relative">
                        {/* UI-001: 알림 없을 때 흰색(회색), 있을 때 검정 + 배지 */}
                        <button
                          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                          className="hover:opacity-70 transition-opacity relative flex items-center gap-1"
                          data-notification-button
                        >
                          <IoIosNotifications 
                            size={20} 
                            className={unreadCount > 0 ? "text-black" : "text-gray-300"}
                          />
                          <span className="text-xs text-gray-600 hidden sm:inline">알림</span>
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </button>
                        
                        {/* Notification Dropdown */}
                        {isNotificationOpen && (
                          <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50" data-notification-dropdown>
                            <div className="p-4 border-b border-gray-200">
                              <h3 className="font-medium text-gray-900">알림</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                              {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                  새로운 알림이 없습니다.
                                </div>
                              ) : (
                                notifications.map((notification) => (
                                  <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                      !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                          {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                          {notification.content}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                          {new Date(notification.createdAt).toLocaleDateString('ko-KR', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </p>
                                      </div>
                                      {!notification.isRead && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0 mt-1"></div>
                                      )}
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                <Link
                  href={ROUTE.MYPAGE_LIKED_PRODUCT}
                  className="hover:opacity-70 transition-opacity flex items-center gap-1"
                >
                  {!user ? (
                    // 로그인하지 않은 경우: 검정색 아웃라인 하트 (테두리만)
                    <IoHeartOutline size={20} className="text-black" />
                  ) : (user.productLikes && user.productLikes.length > 0) ? (
                    // 로그인하고 찜 목록이 있는 경우: 검정색 채워진 하트
                    <IoIosHeart size={20} className="text-black" />
                  ) : (
                    // 로그인하고 찜 목록이 없는 경우: 회색 아웃라인 하트
                    <IoHeartOutline size={20} className="text-gray-400" />
                  )}
                  <span className="text-xs text-gray-600 hidden sm:inline">찜</span>
                </Link>
                <Link
                  href={ROUTE.MYPAGE_CART_PRODUCT}
                  className="hover:opacity-70 transition-opacity relative flex items-center gap-1"
                >
                  <IoBagOutline size={20} />
                  <span className="text-xs text-gray-600 hidden sm:inline">장바구니</span>
                  {cartProducts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {cartProducts.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer - 데스크톱에서도 사용 */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed top-0 left-0 h-full w-80 bg-white z-[100] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <Image
                    src="/image/itsmycolor-logo.png"
                    alt="It&apos;s my color"
                    width={150}
                    height={40}
                    className="h-8 w-auto"
                  />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2"
                  >
                    <IoClose size={24} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {!isLoggedIn ? (
                  <div className="flex gap-4 mb-6">
                    <Link
                      href={ROUTE.SIGNIN}
                      className="flex-1 py-3 text-center border border-black text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link
                      href={ROUTE.SIGNUP}
                      className="flex-1 py-3 text-center bg-black text-white text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      회원가입
                    </Link>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">
                        {user?.name || '사용자'}님
                      </span>
                      <button
                        onClick={onLogout}
                        className="text-sm text-gray-600"
                      >
                        로그아웃
                      </button>
                    </div>
                    <Link
                      href={ROUTE.MYPAGE}
                      className="block py-3 text-center border border-black text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                  </div>
                )}

                {/* Mobile Quick Links */}
                <div className="mb-6 space-y-3">
                  <Link
                    href={ROUTE.BENEFIT}
                    className="block py-3 px-4 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🎁 회원혜택
                  </Link>
                  <Link
                    href={ROUTE.MYPAGE_QNA}
                    className="block py-3 px-4 text-center border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    💬 고객센터
                  </Link>
                </div>

                <nav className="space-y-6">
                  {MENU_CATEGORIES.map((category) => {
                    const isExternalLink = category.path?.startsWith('http');
                    return (
                      <div key={category.name}>
                        <h3 className="font-medium mb-3">{category.name}</h3>
                        {category.subItems ? (
                          <ul className="space-y-2 pl-4">
                            {category.subItems.map((item) => {
                              const isItemExternal = item.path?.startsWith('http');
                              return (
                                <li key={item.name}>
                                  {isItemExternal ? (
                                    <a
                                      href={item.path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {item.name}
                                    </a>
                                  ) : (
                                    <Link
                                      href={item.path}
                                      className="block py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          isExternalLink ? (
                            <a
                              href={category.path!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block py-1 text-sm text-gray-600 hover:text-gray-900 pl-4 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              바로가기
                            </a>
                          ) : (
                            <Link
                              href={category.path!}
                              className="block py-1 text-sm text-gray-600 hover:text-gray-900 pl-4 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              바로가기
                            </Link>
                          )
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>
          </>
        )}

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="원하는 스타일을 검색해보세요"
                className="w-full h-12 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <IoIosSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                size={20}
                onClick={onSearch}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoClose size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Notification Dropdown */}
        {isNotificationOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsNotificationOpen(false)}>
            <div className="absolute top-20 left-4 right-4 bg-white rounded-lg shadow-lg max-h-96 overflow-hidden" data-notification-dropdown>
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">알림</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    새로운 알림이 없습니다.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-gray-900 pr-4">
                  {selectedNotification.title}
                </h2>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedNotification.content}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {new Date(selectedNotification.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
