import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

export const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 32px;
  border-radius: 16px;
`;

export const TwoColumnLayout = styled.div`
  display: flex;
  gap: 100px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled.div`
  flex: 1;
`;

export const RightColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 15px;
    font-weight: 500;
    color: #333;
  }

  .form-input {
    padding: 10px 14px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #fafafa;

    &:focus {
      border-color: #007bff;
      outline: none;
      background: #fff;
    }
  }

  select.form-input {
    cursor: pointer;
  }
`;

export const Con = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

export const SubmitButton = styled.input`
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #005dc1;
  }
`;

export const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 8px;
`;

export const ImagePreview = styled.img`
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
`;
