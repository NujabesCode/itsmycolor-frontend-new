import { axiosInstance } from "../client";

export const fileApi = {
  uploadFile: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/files/upload', formData, {
      headers: {
        // FormData를 사용할 때는 Content-Type을 명시하지 않아야 브라우저가 자동으로 boundary를 설정합니다
      },
      params: folder ? { folder } : undefined,
    });
    
    let fileUrl = response.data.fileUrl;
    
    // 로컬 파일 URL인 경우 (상대 경로로 시작하는 경우) baseURL 추가
    if (fileUrl && fileUrl.startsWith('/uploads/')) {
      const baseURL = axiosInstance.defaults.baseURL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3000` : 'http://localhost:3000');
      fileUrl = `${baseURL}${fileUrl}`;
    }
    
    return fileUrl;
  },
};