import { axiosInstance } from "../client";

export const emailApi = {
  /**
   * 이메일 인증 코드 발송
   * @param email 사용자 이메일 주소
   */
  sendVerification: async (email: string) => {
    return await axiosInstance.post("/email/send-verification", { email });
  },

  /**
   * 이메일 인증 코드 검증
   * @param email 사용자 이메일 주소
   * @param verificationCode 인증 코드
   */
  verifyEmail: async (email: string, verificationCode: string) => {
    return await axiosInstance.post("/email/verify-email", { email, verificationCode });
  },

  /**
   * 비밀번호 재설정 링크 발송
   * @param email 사용자 이메일 주소
   */
  sendPasswordReset: async (email: string) => {
    return await axiosInstance.post("/email/send-password-reset", { email });
  },

  /**
   * 토큰을 사용한 비밀번호 재설정
   * @param token  비밀번호 재설정 토큰
   * @param newPassword 새 비밀번호
   */
  resetPassword: async (token: string, newPassword: string) => {
    return await axiosInstance.post("/email/reset-password", { token, newPassword });
  },
}; 