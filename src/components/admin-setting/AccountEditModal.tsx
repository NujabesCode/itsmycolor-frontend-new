'use client';

import { useEffect, useState } from 'react';
import { Account } from '@/serivces/admin/type';
import { UserRole } from '@/serivces/user/type';
import { adminApi } from '@/serivces/admin/request';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY } from '@/configs/constant/query';

interface AccountEditModalProps {
  account: Account;
  onClose: () => void;
}

export const AccountEditModal = ({ account, onClose }: AccountEditModalProps) => {
  const queryClient = useQueryClient();

  const [editedAccount, setEditedAccount] = useState<Account>(account);

  useEffect(() => {
    setEditedAccount(account);
  }, [account]);

  const onSave = async () => {
    try {
      await adminApi.putAccountRole(editedAccount.id, editedAccount.role as UserRole);
      await adminApi.putAccountStatus(editedAccount.id, editedAccount.isActive);

      await queryClient.invalidateQueries({ queryKey: [QUERY.ADMIN_ACCOUNT_LIST] });

      alert('저장되었습니다.');
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">계정 정보 변경</h2>
          <button onClick={onClose} className="text-grey-47 hover:text-grey-33">
            ✕
          </button>
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                type="text"
                name="name"
                value={editedAccount.name}
                onChange={(e) => setEditedAccount({ ...editedAccount, name: e.target.value })}
                className="w-full px-3 py-2 border border-grey-91 rounded-md bg-gray-200"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                name="email"
                value={editedAccount.email}
                onChange={(e) => setEditedAccount({ ...editedAccount, email: e.target.value })}
                className="w-full px-3 py-2 border border-grey-91 rounded-md bg-gray-200"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">변경할 계정</label>
              <select
                name="role"
                value={editedAccount.role}
                onChange={(e) => setEditedAccount({ ...editedAccount, role: e.target.value })}
                className="w-full px-3 py-2 border border-grey-91 rounded-md"
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">상태</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="활성"
                    defaultChecked={editedAccount.isActive}
                    onChange={(e) => setEditedAccount({ ...editedAccount, isActive: true })}
                    className="mr-2"
                  />
                  활성
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="비활성"
                    defaultChecked={!editedAccount.isActive}
                    onChange={(e) => setEditedAccount({ ...editedAccount, isActive: false })}
                    className="mr-2"
                  />
                  비활성
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-grey-47 hover:text-grey-33">
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-40 text-white rounded-md hover:bg-blue-51"
              onClick={onSave}
            >
              변경사항 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
