import styled from "@emotion/styled";

export const Container = styled.div<{ isDragActive?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
  padding: 24px;
  border: 2px dashed ${({ isDragActive }) => (isDragActive ? "#007bff" : "#ccc")};
  background-color: ${({ isDragActive }) => (isDragActive ? "#f0f8ff" : "#fafafa")};
  border-radius: 12px;
  color: #555;
  transition: 0.3s all ease;
  text-align: center;
  cursor: pointer;

  p {
    margin: 0;
    font-size: 14px;
    color: ${({ isDragActive }) => (isDragActive ? "#007bff" : "#555")};
  }

  &:hover {
    border-color: #007bff;
  }
`;

export const RemoveButton = styled.button`
  align-self: flex-end;
  background: transparent;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #d32f2f;
  cursor: pointer;
  margin-bottom: 8px;

  &:hover {
    color: #a00;
  }
`;
