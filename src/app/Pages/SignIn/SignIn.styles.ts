import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: url("/assets/university_background.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8); // прозорість
    z-index: 0;
  }
`;

export const Content = styled.div`
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InfoCard = styled.div`
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.2);
  max-width: 480px;
  width: 100%;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

export const Description = styled.p`
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.6;
`;

export const SignInButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin: 0 auto;

  &:hover {
    background-color: #357ae8;
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

export const IconWrapper = styled.div`
  background: white;
  border: 2px solid #4285f4;
  border-radius: 4px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }
`;

export const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background: url("/assets/university_background.jpg") no-repeat center center;
    background-size: cover;
    opacity: 0.3; /* 👈 контроль прозорості картинки */
    z-index: 0;
  }
`;





