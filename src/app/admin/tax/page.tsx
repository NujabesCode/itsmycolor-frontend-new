'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/serivces/client';
import { IoDownloadOutline } from 'react-icons/io5';

export default function AdminTax() {
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // FC-009: 세금계산서 목록 조회
  const { data: taxInvoices, isLoading } = useQuery({
    queryKey: ['tax-invoices'],
    queryFn: async () => {
      // 실제 API 엔드포인트로 변경 필요
      const response = await axiosInstance.get('/tax-invoices');
      return response.data;
    },
  });

  // FC-009: 세금계산서 발행
  const issueMutation = useMutation({
    mutationFn: async (settlementId: string) => {
      await axiosInstance.post('/tax-invoices/issue', { settlementId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-invoices'] });
      alert('세금계산서가 발행되었습니다.');
    },
  });

  // FC-010: 세금계산서 다운로드
  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await axiosInstance.get(`/tax-invoices/${invoiceId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `세금계산서_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('세금계산서 다운로드에 실패했습니다.');
    }
  };

  // FC-011: 의무 제출 서류 목록
  const { data: documents } = useQuery({
    queryKey: ['tax-documents'],
    queryFn: async () => {
      // 실제 API 엔드포인트로 변경 필요
      const response = await axiosInstance.get('/tax-documents');
      return response.data;
    },
  });

  // FC-011: 서류 승인/반려
  const documentActionMutation = useMutation({
    mutationFn: async ({ documentId, action, reason }: { documentId: string; action: 'approve' | 'reject'; reason?: string }) => {
      await axiosInstance.put(`/tax-documents/${documentId}/${action}`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-documents'] });
      alert('처리되었습니다.');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-98 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-grey-71">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-98 p-8">
      <h1 className="text-2xl font-bold text-grey-20 mb-6">세금 관리</h1>

      {/* FC-009: 세금계산서 발행 */}
      <div className="bg-white-solid rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-grey-20 mb-4">세금계산서 발행</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-91">
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">정산월</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">브랜드명</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">세금계산서 번호</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">상태</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">작업</th>
              </tr>
            </thead>
            <tbody>
              {taxInvoices && taxInvoices.length > 0 ? (
                taxInvoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b border-grey-91">
                    <td className="py-3 px-4 text-sm text-grey-20">{invoice.settlement?.settlementMonth || '-'}</td>
                    <td className="py-3 px-4 text-sm text-grey-20">{invoice.brand?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm text-grey-20">{invoice.invoiceNumber || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        invoice.status === '발행 완료' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {invoice.status === '발행 대기' && (
                          <button
                            onClick={() => {
                              if (confirm('세금계산서를 발행하시겠습니까?')) {
                                issueMutation.mutate(invoice.settlementId);
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            발행
                          </button>
                        )}
                        {invoice.status === '발행 완료' && (
                          <button
                            onClick={() => handleDownload(invoice.id, invoice.invoiceNumber)}
                            className="px-3 py-1 bg-grey-91 text-grey-20 rounded text-xs hover:bg-grey-80 flex items-center gap-1"
                          >
                            <IoDownloadOutline size={14} />
                            다운로드
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-grey-46">
                    세금계산서 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FC-011: 의무 제출 서류 */}
      <div className="bg-white-solid rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-grey-20 mb-4">의무 제출 서류</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-91">
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">브랜드명</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-grey-20">서류 유형</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">상태</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-grey-20">작업</th>
              </tr>
            </thead>
            <tbody>
              {documents && documents.length > 0 ? (
                documents.map((doc: any) => (
                  <tr key={doc.id} className="border-b border-grey-91">
                    <td className="py-3 px-4 text-sm text-grey-20">{doc.brand?.name || '-'}</td>
                    <td className="py-3 px-4 text-sm text-grey-20">{doc.documentType}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        doc.status === '승인' ? 'bg-green-50 text-green-600' :
                        doc.status === '반려' ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {doc.status === '제출 완료' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              if (confirm('서류를 승인하시겠습니까?')) {
                                documentActionMutation.mutate({ documentId: doc.id, action: 'approve' });
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('반려 사유를 입력해주세요:');
                              if (reason) {
                                documentActionMutation.mutate({ documentId: doc.id, action: 'reject', reason });
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          >
                            반려
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-grey-46">
                    제출된 서류가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}










