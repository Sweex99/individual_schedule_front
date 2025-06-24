import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { NotificationType } from "./Notification.types";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

export const NotificationItem = styled.div<{ type: NotificationType }>`
  padding: 12px 16px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.3s ease-in-out;
  background-color: ${({ type }) => (type === "success" ? "#4caf50" : "#f44336")};
`;
