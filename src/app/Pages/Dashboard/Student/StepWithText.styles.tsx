import styled from "@emotion/styled";

export const StepContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  background-color: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 16px;
  color: #444;
  margin: 0;
`;

export const RejectButton = styled.button`
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c0392b;
  }
`;
