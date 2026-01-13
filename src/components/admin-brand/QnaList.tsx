'use client';

import { useQueryString } from '@/hooks/common/useQueryString';
import { useGetQnaList } from '@/serivces/admin/query';
import { Qna, QnaStatus } from '@/serivces/admin/type';
import { QnaType } from '@/serivces/qna/type';
import React, { useState } from 'react';
import { QnaAnswerModal } from './QnaAnswerModal';
import { Pagination } from '../common/Pagination';

export const QnaList = () => {
  const [type, setType] = useQueryString<string>('type', '');

  const { data: qnasData } = useGetQnaList();

  const qnaList = qnasData?.qnas;
  const lastPage = qnasData?.lastPage;

  const [selectedQna, setSelectedQna] = useState<Qna | null>(null);

  return (
    <section className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-grey-33 mb-4">Q&A 관리</h2>

        {/* 탭 */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150
              ${
                type === ''
                  ? 'border-blue-40 bg-white text-blue-40'
                  : 'border-transparent bg-grey-96 text-grey-47 hover:bg-white'
              }
            `}
            onClick={() => setType('')}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150
              ${
                type === QnaType.BODY
                  ? 'border-blue-40 bg-white text-blue-40'
                  : 'border-transparent bg-grey-96 text-grey-47 hover:bg-white'
              }
            `}
            onClick={() => setType(QnaType.BODY)}
          >
            체형타입
          </button>
          <button
            className={`px-4 py-2 rounded-t-md text-sm font-semibold border-b-2 transition-all duration-150
              ${
                type === QnaType.COLOR
                  ? 'border-blue-40 bg-white text-blue-40'
                  : 'border-transparent bg-grey-96 text-grey-47 hover:bg-white'
              }
            `}
            onClick={() => setType(QnaType.COLOR)}
          >
            퍼스널컬러
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-grey-96 text-grey-33">
                <th className="px-4 py-3 font-semibold text-left">문의번호</th>
                <th className="px-4 py-3 font-semibold text-left">등록일시</th>
                <th className="px-4 py-3 font-semibold text-left">고객명</th>
                <th className="px-4 py-3 font-semibold text-left">문의내용</th>
                <th className="px-4 py-3 font-semibold text-left">질문유형</th>
                <th className="px-4 py-3 font-semibold text-left">상태</th>
                <th className="px-4 py-3 font-semibold text-left">답변</th>
              </tr>
            </thead>
            <tbody>
              {qnaList?.map((qna) => (
                <tr className="border-t border-grey-91" key={'qna' + qna.id}>
                  <td className="px-4 py-3">{qna.id.slice(0, 4)}</td>
                  <td className="px-4 py-3">{qna.createdAt}</td>
                  <td className="px-4 py-3">{qna.user.name}</td>
                  <td className="px-4 py-3">{qna.title}</td>
                  <td className="px-4 py-3">{qna.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded font-semibold ${
                        qna.status === QnaStatus.WAITING
                          ? 'bg-red-90 text-red-20'
                          : 'bg-spring-green-90 text-spring-green-20'
                      }`}
                    >
                      {qna.status === QnaStatus.WAITING ? '미처리' : '답변완료'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {qna.status === QnaStatus.WAITING ? (
                      <button
                        className="text-blue-40 hover:underline"
                        onClick={() => setSelectedQna(qna)}
                      >
                        답변하기
                      </button>
                    ) : (
                      <span className="text-grey-47">답변완료</span>
                    )}
                  </td>
                </tr>
              ))}

              {qnaList?.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-grey-47"
                  >
                    문의가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {lastPage ? <Pagination lastPage={lastPage} /> : null}

        {selectedQna && (
          <QnaAnswerModal
            qna={selectedQna}
            onClose={() => setSelectedQna(null)}
          />
        )}
      </div>
    </section>
  );
};
