import styled from "@emotion/styled";

export const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
`;

export const Sidebar = styled.div`
  background: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  height: fit-content;
`;

export const SettingItem = styled.div<{ selected?: boolean }>`
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 10px;
  background-color: ${({ selected }) => (selected ? "#d4edda" : "transparent")};
  color: ${({ selected }) => (selected ? "#155724" : "#333")};
  transition: background 0.2s ease;

  &:hover {
    background-color: #e9f5ee;
  }
`;

export const MainContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 300px;
`;

export const GroupSettings = styled.div`
  display: flex;
  gap: 20px;
`;

export const GroupList = styled.div`
  flex: 1;
  background: #fafafa;
  border-radius: 10px;
  padding: 15px;
`;

export const GroupItem = styled.div<{ selected?: boolean }>`
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#d4edda" : "#eee")};
  color: ${({ selected }) => (selected ? "#155724" : "#333")};

  &:hover {
    background-color: #e0f3ea;
  }
`;

export const GroupEditor = styled.div`
  flex: 2;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const FileInput = styled.input`
  margin-bottom: 15px;
`;

export const SaveButton = styled.button`
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #43a047;
  }
`;

export const Placeholder = styled.div`
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-top: 100px;
`;


