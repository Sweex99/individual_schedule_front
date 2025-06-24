import { useState } from "react";
import apiClient from "../../unitilies/axiosClient";
import { PageWrapper, Container, Content, SignInButton, InfoCard, Title, Description, IconWrapper } from "./SignIn.styles";

export const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const clickHandler = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/users/saml/sign_in");
      const sso_link = response.data["sso_link"];
      if (sso_link) {
        window.location.href = sso_link;
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Content>
          <InfoCard>
            <Title>👋 Вітаємо</Title>
            <Description>
              Це внутрішній сервіс <strong>Прикарпатського національного університету ім. Василя Стефаника</strong>.
              Для продовження, увійдіть через вашу університетську пошту <strong>@pnu.edu.ua</strong>.
            </Description>
            <SignInButton onClick={clickHandler} disabled={loading}>
              <IconWrapper>
                <img src="/assets/icons8-google.svg" alt="Google" />
              </IconWrapper>
              {loading ? "Вхід..." : "Увійти через Google"}
            </SignInButton>
          </InfoCard>
        </Content>
      </Container>
    </PageWrapper>
  );
};