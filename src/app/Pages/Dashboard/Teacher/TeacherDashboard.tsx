import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { getAllAdminRequests, getAllTeacherRequests, getStatement, setStatus, setTeacherComment } from "../../../Services/RequestService";
import { User } from "../../../Models/User";
import { Subject } from "../../../Models/Subject";
import { Request } from "../../../Models/Request";
import { getTeacherTemplates, saveTemplate } from "../../../Services/TemplateService";
import { useAuth } from "../../../Context/useAuth";
import { Reason } from "../../../Models/Reason";

interface TeacherRequest {
  id: number;
  state: string;
  comment: string;
  request: Request;
  subject: Subject;
  teacher: User;
  created_at: string;
}

interface TeacherResponse {
  subject: Subject;
  teacher: any;
  comment: string;
  state: string;
}

interface AdminRequest {
  id: number;
  state: string;
  student: User;
  created_at: string;
  subjects_teachers: TeacherResponse[];
  reason: Reason;
  image_url?: string;
}

interface CommentTemplate {
  id: number;
  title: string;
  text: string;
  teacher_id: number;
}

export const TeacherDashboard = () => {
  const [requests, setRequests] = useState<TeacherRequest[]>([]);
  const [requestsAdmin, setRequestsAdmin] = useState<AdminRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TeacherRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TeacherRequest | null>(null);
  const [selectedRequestAdmin, setSelectedRequestAdmin] = useState<AdminRequest | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [searchName, setSearchName] = useState<string>("");
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<CommentTemplate[]>([]);
  const [isSavingTemplate, SetIsSavingTemplate] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("");
  const currentUser = useAuth();
  const [openImage, setOpenImage] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      var response: TeacherRequest[] = [];
      var admin_response = [];

      if (filterStatus === "deanery_approved") {
        admin_response = await getAllAdminRequests('deanery_approved');
        
        setRequestsAdmin(admin_response);
        setSelectedRequestAdmin(admin_response[0])
      } else if (filterStatus === "fully_approved") {
        admin_response = await getAllAdminRequests('fully_approved');
        
        setRequestsAdmin(admin_response);
        setSelectedRequestAdmin(admin_response[0])
      } else {
        response = await getAllTeacherRequests(filterStatus);
        const response1 = await getTeacherTemplates();
        setRequests(response);
        setTemplates(response1);
        setFilteredRequests(response);
        setSelectedRequest(response[0]);
        setComment(response[0]?.comment);
      }

    } catch (error) {
      setError("Помилка завантаження запитів");
      console.error("Помилка отримання запитів:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const submitTeacherComment = async (state: string) => {
    try {
      setDetailsLoading(true);

      if (selectedRequest) {
        const response = await setTeacherComment(selectedRequest.id, state, comment);
        setSelectedRequest(response);
        fetchRequests();
      }
    } catch (error) {
      setError("Помилка завантаження запитів");
      console.error("Помилка отримання запитів:", error);
    } finally {
      setDetailsLoading(false);
    }
  }

  const isNewTemplate = (text: string) => {
  const cleanedText = text !== null ? text.trim().toLowerCase() : '';
    return !!cleanedText && !templates.some(t => t.text.trim().toLowerCase() === cleanedText);
  };

  const handleSaveTemplate = async (text: string, title: string) => {
    const newTemplate = {
      title: title,
      text: comment
    };
  
    try {
      const saved = await saveTemplate(newTemplate);
      setTemplates([...templates, saved]);
    } catch (e) {
      console.error("Помилка при збереженні шаблону:", e);
    }
  };

  const submitStatus = async (state: string) => {
    try {
      setDetailsLoading(true);

      if (selectedRequest) {
        const response = await setStatus(selectedRequest.id, state);
        setSelectedRequest(response);
        fetchRequests();
      }
    } catch (error) {
      setError("Помилка завантаження запитів");
      console.error("Помилка отримання запитів:", error);
    } finally {
      setDetailsLoading(false);
    }
  }
  
  const nextRequestStatus = (stateName: string) => {
    return stateName === "submitted" ? 'deanery_approve' : stateName === 'deanery_approved' ? 
    "department_approve" : stateName === 'department_approved' ? "teacher_approve" : 
    stateName === 'teacher_approved' ? "fully_approve" : stateName === 'fully_approved' ? 'cancell' : ""
  }

  const downloadPdf = async (requestId: number) => {
    try {
      const response = await getStatement(requestId);
  
      const blobUrl = URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `request_${selectedRequest?.id}.pdf`;
      link.click();
  
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Помилка завантаження PDF:", error);
      alert("Не вдалося завантажити PDF");
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

  if (loading) return <Message>⏳ Завантаження...</Message>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>📋 Список запитів</Title>
      <Wrapper>
        <FiltersSection>
          <h2>🔍 Фільтри</h2>
          <Input
            placeholder="Пошук студента..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <optgroup label="- Учитель -">
              <option value="pending">В Очікуванні</option>
              <option value="approved">Затверджено</option>
              <option value="rejected">Відхилено</option>
              <option value="all">Усі</option>
            </optgroup>
            <optgroup label="- Зав. кафедри -">
              {currentUser?.user?.grand_teacher ? <option value="deanery_approved">Підтвердження кафедрою</option> : ''}
              {currentUser?.user?.grand_teacher ? <option value="fully_approved">Підтведжені</option> : ''}
            </optgroup>
          </Select>
          <label>
            <input type="checkbox" checked={sortByDate} onChange={() => setSortByDate(!sortByDate)} /> Сортувати за датою
          </label>
        </FiltersSection>

        { filterStatus === "deanery_approved" || filterStatus === "fully_approved" ? 
          <RequestsSection>
            <h2>📋 Запити</h2>
            {loading ? (
              <p>Завантаження...</p>
            ) : requestsAdmin.length === 0 ? (
              <p>Немає запитів</p>
            ) : (
              requestsAdmin.map((req) => (
                <RequestCard key={req.id} onClick={() => setSelectedRequestAdmin(req)}>
                  <div>
                    <strong>{req.student.first_name} {req.student.last_name}</strong>
                    <p>#{req.id}</p>
                  </div>
                  <StatusBadge state={req.state}>{req.state}</StatusBadge>
                </RequestCard>
              ))
            )}
          </RequestsSection>
          :
          <RequestsSection>
            <h2>📋 Запити</h2>
            {loading ? (
              <p>Завантаження...</p>
            ) : filteredRequests.length === 0 ? (
              <p>Немає запитів</p>
            ) : (
              filteredRequests.map((teacher_request) => (
                <RequestCard key={teacher_request.id} onClick={() => { setSelectedRequest(teacher_request); setComment(teacher_request.comment);}}>
                  <div>
                    <strong>{teacher_request.request.student.first_name} {teacher_request.request.student.last_name}</strong>
                    <p>#{teacher_request.request.id}</p>
                  </div>
                  <StatusBadge state={teacher_request.state}>{teacher_request.state}</StatusBadge>
                </RequestCard>
              ))
            )}
          </RequestsSection>
        }

        { filterStatus == "deanery_approved" || filterStatus === "fully_approved" ?
            <>
              <DetailsSection>
              {selectedRequestAdmin ? (
                <>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>
                    Деталі запиту #{selectedRequestAdmin.id}
                  </h3>

                  <InfoBlock>
                    <Label>Студент:</Label>
                    <Value>{selectedRequestAdmin.student.first_name} {selectedRequestAdmin.student.last_name} ({selectedRequestAdmin.student.group.title} {selectedRequestAdmin.student.semester}-семестр)</Value>
                  </InfoBlock>

                  <InfoBlock>
                    <Label>Статус:</Label>
                    <Value><StatusBadge state={selectedRequestAdmin.state}>{selectedRequestAdmin.state}</StatusBadge></Value>
                  </InfoBlock>

                  <InfoBlock>
                    <Label>Причина:</Label>
                    <Value>{selectedRequestAdmin.reason.title}</Value>
                  </InfoBlock>

                  <InfoBlock>
                    <Label>Час подачі:</Label>
                    <Value>{formatted(selectedRequestAdmin.created_at)}</Value>
                  </InfoBlock>

                  <ActionButtons>
                    <Button variant="approve" onClick={() => submitStatus(nextRequestStatus(selectedRequestAdmin.state))}>Підтвердити</Button>
                    <Button variant="reject" onClick={() => submitStatus("reject")}>Відхилити</Button>
                  </ActionButtons>

                  {selectedRequestAdmin.image_url && (
                    <>
                      <Label>Зображення:</Label>
                      <div>
                        <PreviewImage
                          src={selectedRequestAdmin.image_url}
                          alt="img"
                          onClick={() => setOpenImage(selectedRequestAdmin.image_url!)}
                          style={{ cursor: "zoom-in" }}
                        />
                      </div>
                    </>
                  )}

                  <DownloadButton onClick={() => downloadPdf(selectedRequestAdmin.id)}>
                    Завантажити PDF
                  </DownloadButton>
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
          </>
        :
          <RequestDetails>
            {selectedRequest ? (
              detailsLoading ? (
                <Message>⏳ Завантаження...</Message>
              ) : (
              <>
                <h3>📝 Деталі запиту</h3>
                <p><strong>Студент:</strong> {selectedRequest.request.student.first_name} {selectedRequest.request.student.last_name} ({selectedRequest.request.student.group.title}-{selectedRequest.request.student.semester/2})</p>
                <p><strong>Дата створення:</strong> {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                <p><strong>Предмет:</strong> {selectedRequest.subject.name} ({selectedRequest.subject.hours_count} годин)</p>
                <p><strong>Причина:</strong> {selectedRequest.request.reason.title}</p>
                <p><strong>Статус:</strong> <StatusBadge state={selectedRequest.state}>{selectedRequest.state}</StatusBadge></p>

                <label><h4>✍️ Коментар:</h4></label>
                <TextArea
                  key={selectedRequest.id}
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Додайте коментар..."
                />

                <ActionButtons>
                  <Button variant="approve" onClick={() => submitTeacherComment("approve")}>Підтвердити</Button>
                  <Button variant="reject" onClick={() => submitTeacherComment("reject")}>Відхилити</Button>
                </ActionButtons>

                {isSavingTemplate ? (
                  <TemplateForm onSubmit={(e) => {
                    e.preventDefault();
                    const title = customTitle !== null && customTitle.trim() !== ""
                      ? customTitle.trim()
                      : comment.trim().split(" ").slice(0, 5).join(" ");

                    handleSaveTemplate(comment, title);
                    SetIsSavingTemplate(false);
                    setCustomTitle(""); // reset
                  }}>
                    <label>
                      <strong>Назва шаблону:</strong>
                      <TemplateInput
                        type="text"
                        placeholder="Наприклад: Відмова без поважної причини"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                      />
                    </label>
                    <TemplateTitlePreview>
                      🧠 <i>Якщо поле порожнє, буде використано:</i><br />
                      <code>{comment.trim().split(" ").slice(0, 5).join(" ")}</code>
                    </TemplateTitlePreview>
                    <FormButtons>
                      <SaveTemplateButton type="submit">✅ Зберегти</SaveTemplateButton>
                      <CancelTemplateButton type="button" onClick={() => {
                        SetIsSavingTemplate(false);
                        setCustomTitle("");
                      }}>❌ Скасувати</CancelTemplateButton>
                    </FormButtons>
                  </TemplateForm>
                ) : (
                  <SaveButton
                    disabled={!isNewTemplate(comment)}
                    onClick={() => SetIsSavingTemplate(true)}
                  >
                    💾 Зберегти як шаблон
                  </SaveButton>
                )}

                <div style={{ marginTop: "20px" }}>
                  <h4>📂 Шаблони коментарів</h4>
                  <TemplateList>
                    {templates.map((t) => (
                      <TemplateItem key={t.id} onClick={() => setComment(t.text)}>
                        {t.title}
                      </TemplateItem>
                    ))}
                  </TemplateList>
                </div>
              </>
              )
            ) : <Message>Оберіть запит</Message> }
          </RequestDetails>
        }
      </Wrapper>
    </Container>
  );
};

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
    state.includes("reject") ? "#f87171" :
    state.includes("approve") ? "#34d399" : "#60a5fa"};
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

const TemplateForm = styled.form`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TemplateInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const TemplateTitlePreview = styled.div`
  font-size: 13px;
  color: #666;
  font-style: italic;
`;

const FormButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const SaveTemplateButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;

const CancelTemplateButton = styled.button`
  background: #F44336;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #e53935;
  }
`;


const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
`;

const TemplateItem = styled.button`
  background: #f0f0f0;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #e0e0e0;
  }
`;

const SaveButton = styled.button`
  margin-top: 10px;
  background: #2196F3;
  color: white;
  padding: 8px 14px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:disabled {
    background: #9E9E9E;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: #1976D2;
  }
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  align-items: start;
`;

const Sidebar = styled.div`
  position: sticky;
  top: 20px;
  height: fit-content;
`;

const RequestList = styled.div`
  flex: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const RequestDetails = styled.div`
  min-width: 200px;
  max-width: 400px;
  flex: 1;
  position: sticky;
  top: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const UserName = styled.strong`
  font-size: 18px;
`;

const DateText = styled.span`
  font-size: 14px;
  color: #777;
`;

const Filters = styled.div`
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  width: -webkit-fill-available;
  min-height: 120px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background: #f9f9f9;
  resize: none;
  transition: border 0.3s ease, background 0.3s ease;

  &:focus {
    border-color: #007bff;
    background: white;
    outline: none;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 15px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
`;

const FilterCheckbox = styled.input`
  margin-right: 10px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
`;

const Message = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #555;
  padding: 20px;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: red;
  padding: 20px;
`;
