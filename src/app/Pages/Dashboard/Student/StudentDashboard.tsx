import { useEffect, useState } from "react";
import "react-step-progress/dist/index.css";
import "./StudentDashboard.css";
import styled from "@emotion/styled";
import { getAllRequests } from "../../../Services/RequestService";
import { Request } from '../../../Models/Request'
import { FourthStep } from "./Steps/FourthStep/FourthStep";
import ModalWindow from '../../../Components/ModalWindow/ModalWindow'
import { FirstStep } from "./Steps/FirstStep/FirstStep";

export const StudentDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("submit");
  const [searchName, setSearchName] = useState<string>("");
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [markedRequests, setMarkedRequests] = useState<number[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await getAllRequests();
      setRequests(data);
    } catch {
      alert("Помилка при завантаженні запитів");
    } finally {
      setLoading(false);
    }
  };

  const formatted = (rawDate: string) => {
      return new Date(rawDate).toLocaleString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
  }

  const normalizeState = (state: string) => {
    if (state === "submitted") {
      return "Очікування підтведження деканатом"
    } else if (state === "deanery_approved") {
      return "Очікування підтведження кафедрою"
    } else if (state === "department_approved") {
      return "Очікування підтведження викладачами"
    } else if (state === "teacher_approved") {
      return "Очікування підтведження радою"
    } else if (state === "fully_approved") {
      return "Затверджено"
    } else if (state === "rejected") {
      return "Відхилено"
    } else if (state === "cancelled") {
      return "Закрито"
    }  else if (state === "all") {
      return "Всі"
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  return (
    <Container>
      <Title>📋 Список запитів</Title>
      <Wrapper>
        <FiltersSection>
          <h2>ℹ️ Інформація</h2>
          Для подачі запиту на індивідуальний графік потрібно буде прикріпити фото документа який за яким ви можете притендувати на нього
        </FiltersSection>

        <RequestsSection>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>📋 Запити</h2>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              {markedRequests.length > 0 ? "Скасувати всі" : "Подати заяву"}
            </button>
          </div>
          {loading ? (
            <p>Завантаження...</p>
          ) : requests.length === 0 ? (
            <p>Немає запитів</p>
          ) : (
            requests.map((req) => (
              <RequestCard key={req.id} onClick={() => setSelectedRequest(req)}>
                <div>
                  <strong>{req.student.first_name} {req.student.last_name}</strong>
                  <p>#{req.id}</p>
                </div>
                <StatusBadge state={req.state}>{normalizeState(req.state)}</StatusBadge>
              </RequestCard>
            ))
          )}
        </RequestsSection>

        <DetailsSection>
          {selectedRequest ? (
            <>

              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>
                Деталі запиту #{selectedRequest.id}
              </h3>

              <InfoBlock>
                <Label>Статус:</Label>
                <Value><StatusBadge state={selectedRequest.state}>{normalizeState(selectedRequest.state)}</StatusBadge></Value>
              </InfoBlock>

              <InfoBlock>
                <Label>Причина:</Label>
                <Value>{selectedRequest.reason.title}</Value>
              </InfoBlock>

              <InfoBlock>
                <Label>Час подачі:</Label>
                <Value>{formatted(selectedRequest.created_at)}</Value>
              </InfoBlock>

              {selectedRequest.image_url && (
                <>
                  <Label>Зображення:</Label>
                  <div>
                    <PreviewImage
                      src={selectedRequest.image_url}
                      alt="img"
                      onClick={() => setOpenImage(selectedRequest.image_url!)}
                      style={{ cursor: "zoom-in" }}
                    />
                  </div>
                </>
              )}

              { selectedRequest.state == "department_approved"  && (<FourthStep currentRequest={selectedRequest} />)}
            </>
          ) : (
            <p style={{ color: "#6b7280" }}>Оберіть запит для перегляду деталей</p>
          )}
        </DetailsSection>

        {openImage && (
          <Modal onClick={() => setOpenImage(null)}>
            <img src={openImage} alt="modal" />
          </Modal>
        )}
      </Wrapper>
      <ModalWindow isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <FirstStep />
      </ModalWindow>
    </Container>
  );
}

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  gap: 20px;
  padding: 24px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f4f6f8;
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  max-height: min-content;
  overflow-y: auto;
  min-width: 13vw;
`;

const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectedCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f4f6f8;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const RemoveBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #ef4444;

  &:hover {
    color: #dc2626;
  }
`;

const RequestsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
`;

const RequestCard = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  background: #f4f6f8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #eef4ff;
  }
`;

const DetailsSection = styled.div`
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-aling: center;
  overflow-y: auto;
  max-height: min-content;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
`;

const Value = styled.span`
  font-size: 16px;
  color: #111827;
`;

const DownloadButton = styled.button`
  padding: 10px 18px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const PreviewImage = styled.img`
  max-width: 400px;
  border-radius: 12px;
  margin-top: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const ApproveButton = styled.button`
  padding: 10px 18px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #059669;
  }
`;

const RejectButton = styled.button`
  padding: 10px 18px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #dc2626;
  }
`;

const Button = styled.button<{ variant: 'approve' | 'reject' }>`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;

  background-color: ${({ variant }) =>
    variant === 'approve' ? '#4CAF50' : '#F44336'};
  
  &:hover {
    background-color: ${({ variant }) =>
      variant === 'approve' ? '#45a049' : '#e53935'};
  }
`;


const StatusBadge = styled.span<{ state: string }>`
  background-color: ${({ state }) =>
    state.includes("reject") || state.includes("cancelled") ? "#f87171" :
    state.includes("fully_approved") ? "#34d399" : "#ff9933"};
  color: white;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  text-transform: capitalize;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #3b82f6;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 12px;
  }
`;
