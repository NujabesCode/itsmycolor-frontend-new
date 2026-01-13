"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IoPersonCircle,
  IoSettingsSharp,
  IoBagHandle,
  IoHelpCircle,
  IoStorefront,
  IoLogOut,
  IoChevronForward,
  IoColorPalette,
  IoBody,
  IoMail,
  IoCalendar,
} from "react-icons/io5";
import { ROUTE } from "@/configs/constant/route";
import { useGetUser } from "@/serivces/user/query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatDate } from "@/utils/date";
import { useEffect } from "react";
import { useGetFitProductList } from "@/serivces/product/query";

const BODYTYPE_EXPLANATION = {
  스트레이트: "어깨와 골반이 비슷한 너비로 직선형이며, 상체가 발달되어 글래머러스한 인상을 주는 체형입니다.",
  웨이브: "전체적으로 곡선형이며, 어깨보다 골반이 넓고 팔다리는 가늘며 체구가 작고 여린 인상을 주는 체형입니다.",
  내추럴: "뼈대가 도드라지며 관절이 뚜렷하고, 전체적인 비율이 안정적인 체형입니다.",
};

const getSeasonColor = (season?: string) => {
  if (!season) return { bg: "bg-gray-100", text: "text-gray-700" };
  if (season.includes("Spring")) return { bg: "bg-pink-100", text: "text-pink-700" };
  if (season.includes("Summer")) return { bg: "bg-blue-100", text: "text-blue-700" };
  if (season.includes("Autumn")) return { bg: "bg-orange-100", text: "text-orange-700" };
  if (season.includes("Winter")) return { bg: "bg-purple-100", text: "text-purple-700" };
  return { bg: "bg-gray-100", text: "text-gray-700" };
};

export default function MyPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [{ data: user }, { data: colorAnalysis }] = useGetUser();

  const { data: productsData } = useGetFitProductList(
    colorAnalysis?.bodyType ?? undefined,
    colorAnalysis?.colorSeason ?? undefined,
  );
  const products = productsData?.products ?? [];

  useEffect(() => {
    if (user && !user.name) {
      alert("추가 정보를 입력해주세요.");

      router.replace(ROUTE.MYPAGE_ONBOARD);
    }
  }, [user]);

  const onLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    router.push(ROUTE.MAIN);
  };

  const menuItems = [
    {
      icon: IoPersonCircle,
      title: "내 정보",
      description: "프로필 및 계정 설정",
      href: ROUTE.MYPAGE_TYPE(),
      color: "blue",
    },
    {
      icon: IoBagHandle,
      title: "주문 내역",
      description: "주문 및 배송 조회",
      href: ROUTE.MYPAGE_ORDER,
      color: "green",
    },
    {
      icon: IoHelpCircle,
      title: "문의 내역",
      description: "Q&A 및 고객 지원",
      href: ROUTE.MYPAGE_QNA,
      color: "purple",
    },
    // {
    //   icon: IoStorefront,
    //   title: "판매자 신청",
    //   description: "브랜드 입점 신청",
    //   href: ROUTE.MYPAGE_SELLER_APPLY,
    //   color: "orange",
    // },
  ];

  const seasonColor = getSeasonColor(colorAnalysis?.colorSeason || undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
          <p className="text-gray-600">나만의 스타일을 완성하세요</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-pink-400 to-yellow-400 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <IoPersonCircle size={80} className="text-white/80" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{user?.name || "사용자"}님</h2>
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-white/90">
                  <div className="flex items-center gap-2">
                    <IoMail size={18} />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoCalendar size={18} />
                    <span className="text-sm">가입일: {user && formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* UI-037: 프로필 수정 버튼 - 실제 프로필 수정 페이지로 이동 */}
              <button
                onClick={() => router.push(ROUTE.MYPAGE_PROFILE)}
                className="bg-white/20 backdrop-blur hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 text-white"
              >
                <IoSettingsSharp size={20} />
                프로필 수정
              </button>
            </div>
          </div>

          {/* Body Info */}
          {colorAnalysis && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <IoBody size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">체형</p>
                    <p className="font-semibold text-gray-900">{colorAnalysis.bodyType ?? "없음"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <IoColorPalette size={24} className="text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">퍼스널 컬러</p>
                    <p className={`font-semibold ${seasonColor.text}`}>{colorAnalysis.colorSeason ?? "없음"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-auto text-sm text-gray-600">
                  <div>
                    {colorAnalysis.height != null ? (
                      <>
                        <span className="font-medium">{colorAnalysis.height}</span>cm
                      </>
                    ) : (
                      "없음"
                    )}
                  </div>
                  <div>
                    {colorAnalysis.weight != null ? (
                      <>
                        <span className="font-medium">{colorAnalysis.weight}</span>kg
                      </>
                    ) : (
                      "없음"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const colorClasses = {
              blue: "bg-gradient-to-br from-pink-400 to-pink-500 group-hover:from-pink-500 group-hover:to-pink-600",
              green:
                "bg-gradient-to-br from-green-400 to-green-500 group-hover:from-green-500 group-hover:to-green-600",
              purple:
                "bg-gradient-to-br from-yellow-400 to-orange-400 group-hover:from-yellow-500 group-hover:to-orange-500",
              orange: "bg-gradient-to-br from-red-400 to-pink-400 group-hover:from-red-500 group-hover:to-pink-500",
            };

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-100"
              >
                <div
                  className={`w-14 h-14 ${
                    colorClasses[item.color as keyof typeof colorClasses]
                  } rounded-2xl flex items-center justify-center mb-4 transition-colors`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                <div className="flex items-center text-sm font-medium text-pink-600 group-hover:text-pink-700">
                  바로가기
                  <IoChevronForward size={16} className="ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Type Analysis Result */}
        {colorAnalysis && (
          <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">나의 스타일 분석</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <IoBody className="text-green-500" />
                  체형 분석: {colorAnalysis.bodyType ?? "없음"}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {colorAnalysis.bodyType
                    ? BODYTYPE_EXPLANATION[colorAnalysis.bodyType as keyof typeof BODYTYPE_EXPLANATION]
                    : "없음"}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <IoColorPalette className="text-pink-500" />
                  퍼스널 컬러: {colorAnalysis.colorSeason ?? "없음"}
                </h4>
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-full ${seasonColor.bg} ${seasonColor.text} text-sm font-medium`}>
                    {colorAnalysis.colorSeason ?? "없음"}
                  </div>
                  <Link
                    href={`${ROUTE.SHOPPING}?colorSeasons=${encodeURIComponent(JSON.stringify([colorAnalysis.colorSeason]))}`}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    추천 상품 보기 →
                  </Link>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* Recommended Products */}
        {products.length > 0 && (
          <div className="bg-white rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">추천 상품</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((product) => (
                <Link key={product.id} href={ROUTE.SHOPPING_PRODUCT_DETAIL(product.id)} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}

                    {/* Sold Out Badge */}
                    {(!product.isAvailable || product.stockQuantity < 1) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">품절</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Brand */}
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>

                    {/* Product Name */}
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex justify-start items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        ₩{product.price.toLocaleString()} (${product.usdPrice.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {products.length > 8 && (
              <div className="text-center mt-8">
                <Link
                  href={`${ROUTE.SHOPPING}?colorSeasons=${encodeURIComponent(
                    JSON.stringify([colorAnalysis?.colorSeason]),
                  )}`}
                  className="px-6 py-3 border border-gray-800 text-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition-colors"
                >
                  더 많은 상품 보기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={onLogout}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-2 mx-auto"
          >
            <IoLogOut size={18} />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
