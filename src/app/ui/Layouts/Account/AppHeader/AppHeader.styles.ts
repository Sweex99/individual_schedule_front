import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Link as RouterLink } from 'react-router-dom';

export const Root = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  padding: 0 30px;
  background-color: #f9f9f9;
  border-bottom: 4px solid #4caf50;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

export const LeftItems = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const RightItems = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const NavLink = styled(RouterLink)`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #e0f2f1;
  }
`;

export const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #d32f2f;
  cursor: pointer;
`;

export const NotificationWrapper = styled.div`
  position: relative;
  margin-left: 16px;
`;

export const NotificationIcon = styled.div`
  cursor: pointer;
  position: relative;
  font-size: 20px;
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -10px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  font-weight: bold;
`;

export const NotificationDropdown = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  width: 250px;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
`;

export const NotificationItem = styled.div<{ $unread?: boolean }>`
  padding: 10px 14px;
  font-size: 14px;
  border-bottom: 1px solid #f3f4f6;
  background: ${({ $unread }) => ($unread ? '#fef2f2' : '#fff')};

  &:last-child {
    border-bottom: none;
  }
`;

