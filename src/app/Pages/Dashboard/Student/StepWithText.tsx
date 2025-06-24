import React from "react";
import { StepContainer, StepContent, Title, Description, RejectButton } from "./StepWithText.styles";
import { setStatus } from "../../../Services/RequestService";
import { Request } from "../../../Models/Request"

interface StepWithTextProps {
  title: string;
  description: string;
  currentRequest: Request;
}

export const StepWithText: React.FC<StepWithTextProps> = ({ title, description, currentRequest }) => {
  const submitStatus = async () => {
    try {
      if (currentRequest) {
        await setStatus(currentRequest.id, "reject");
        window.location.reload();
      }
    } catch (error) {
      console.error("Помилка отримання запитів:", error);
    }
  }

  return (
    <StepContainer>
      <StepContent>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </StepContent>
      <RejectButton onClick={submitStatus}>Відхилити</RejectButton>
    </StepContainer>
  );
};
