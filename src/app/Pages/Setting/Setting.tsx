import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { createGroup, getGroups, updateGroup } from "../../Services/GroupService";
import { createReason, getReasons, updateReason } from "../../Services/ReasonService";
import { Group } from "../../Models/Group";
import { Reason } from "../../Models/Reason";
import { User } from "../../Models/User";
import { getUsers, updateUser } from "../../Services/UsersService";
import { Subject } from "../../Models/Subject";
import { createSubject, getAllSubjects, updateSubject } from "../../Services/SubjectService";

export const SettingsPage = () => {
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  useEffect(() => {
    if (selectedSetting === "groups") {
      fetchGroups();
    } else if (selectedSetting === "reasons") {
      fetchReasons();
    } else if (selectedSetting === "users") {
      fetchUsers();
    } else if (selectedSetting === "subjects") {
      fetchSubjects();
    }
  }, [selectedSetting, selectedReason, selectedUser]);

  const fetchGroups = async () => {
    const response = await getGroups();

    setGroups(response);
  };

  const fetchReasons = async () => {
    const response = await getReasons();

    setReasons(response);
  };

  const fetchUsers = async () => {
    const response = await getUsers();

    setUsers(response);
  };

  const fetchSubjects = async () => {
    const response = await getAllSubjects(undefined, undefined);

    setSubjects(response);
  };

  const handleReasonSave = async () => {
    if (!selectedReason) return;

    const formData = new FormData();
    formData.append("title", selectedReason.title);
    formData.append("description", selectedReason.description);

    try {
      if (selectedReason.id === 0) {
        await createReason(formData);
        alert("Групу створено успішно ✅");
      } else {
        await updateReason(selectedReason.id, formData);
        alert("Групу оновлено успішно ✅");
      }
      fetchReasons();
    } catch (error) {
      console.error("Помилка при збереженні групи:", error);
      alert("Не вдалося зберегти групу ❌");
    }
  };

  const handleGroupSave = async () => {
    if (!selectedGroup) return;

    const formData = new FormData();
    formData.append("title", selectedGroup.title);
    formData.append("description", selectedGroup.description);
    formData.append("statement_head_text", selectedGroup.statement_head_text.replace(/\r\n/g, '\n'));

    if (excelFile) {
      formData.append("subjects_file", excelFile);
    }

    try {
      if (selectedGroup.id === 0) {
        await createGroup(formData);
        alert("Групу створено успішно ✅");
      } else {
        await updateGroup(selectedGroup.id, formData);
        alert("Групу оновлено успішно ✅");
      }
      fetchGroups();
    } catch (error) {
      console.error("Помилка при збереженні групи:", error);
      alert("Не вдалося зберегти групу ❌");
    }
  };

  const handleUserSave = async () => {
    if (!selectedUser) return;

    const formData = new FormData();
    formData.append("user[first_name]", selectedUser.first_name);
    formData.append("user[last_name]", selectedUser.last_name);
    formData.append("user[type]", selectedUser.type);
    formData.append("user[grand_teacher]", String(selectedUser.grand_teacher));

    try {
      await updateUser(selectedUser.id, formData);
      alert("Користувача оновлено успішно ✅");
    } catch (error) {
      console.error("Помилка при збереженні користувача:", error);
      alert("Не вдалося зберегти користувача ❌");
    }
  };

  const handleSubjectSave = async () => {
    if (!selectedSubject) return;

    const formData = new FormData();
    formData.append("subject[name]", selectedSubject.name);
    formData.append("subject[hours_count]", selectedSubject.hours_count);

    try {
       if (selectedSubject.id === 0) {
        await createSubject(formData);
        alert("Групу створено успішно ✅");
      } else {
       await updateSubject(selectedSubject.id, formData);
        alert("Групу оновлено успішно ✅");
      }
      fetchSubjects();
    } catch (error) {
      console.error("Помилка при збереженні групи:", error);
      alert("Не вдалося зберегти групу ❌");
    }
  };

  const newRecord = async (type: String) => {
    if (type === "groups") {
      const group: Group = { id: 0, title: "", description: "", statement_head_text: "" }

      setSelectedGroup(group)
    } else if (type === "reasons") {
      const reason: Reason = { id: 0, title: "", description: "" }

      setSelectedReason(reason)
    } else if (type === "subjects") {
      const subject: Subject = { id: 0, name: "", hours_count: "" }

      setSelectedSubject(subject)
    }
  }

  return (
    <Container>
      <Title>🔧 Список налаштувань</Title>
      <Wrapper>
        <FiltersSection>
          <h3>Меню</h3>
          <SettingItem
              selected={selectedSetting === "groups"}
              onClick={() => setSelectedSetting("groups")}
            >
              📚 Групи
            </SettingItem>
            <SettingItem
              selected={selectedSetting === "reasons"}
              onClick={() => setSelectedSetting("reasons")}
            >
              🎯 Причини
            </SettingItem>
            <SettingItem
              selected={selectedSetting === "subjects"}
              onClick={() => setSelectedSetting("subjects")}
            >
              📚 Предмети
            </SettingItem>
            <SettingItem
              selected={selectedSetting === "users"}
              onClick={() => setSelectedSetting("users")}
            >
              🙍‍♂️ Користувачі
            </SettingItem>
        </FiltersSection>

        <DetailsSection>
            {selectedSetting === "groups" ? (
                <GroupSettings>
                  <GroupList>
                    <ListHead>
                      <h4>Список груп:</h4>
                      <AddButton onClick={() => { newRecord('groups') }}>
                        Новий запис
                      </AddButton>
                    </ListHead>
                    
                    {groups.map((group) => (
                      <GroupItem
                        key={group.id}
                        onClick={() => setSelectedGroup(group)}
                        selected={selectedGroup?.id === group.id}
                      >
                        {group.title}
                      </GroupItem>
                    ))}
                  </GroupList>

                </GroupSettings>
              ) : selectedSetting === "reasons" ?
                (<GroupSettings>
                  <GroupList>
                     <ListHead>
                      <h4>Список причин:</h4>
                      <AddButton  onClick={() => newRecord('reasons')}>Новий запис</AddButton >
                    </ListHead>
                    {reasons.map((reason) => (
                      <GroupItem
                        key={reason.id}
                        onClick={() => setSelectedReason(reason)}
                        selected={selectedReason?.id === reason.id}
                      >
                        {reason.title}
                      </GroupItem>
                    ))}
                  </GroupList>
                </GroupSettings>)
                : selectedSetting === "users" ? 
                  (<GroupSettings>
                    <GroupList>
                      <ListHead>
                        <h4>Список користувачів:</h4>
                      </ListHead>
                      {users.map((user) => (
                        <GroupItem
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          selected={selectedUser?.id === user.id}
                        >
                          {user.first_name} {user.last_name}
                        </GroupItem>
                      ))}
                    </GroupList>
                  </GroupSettings>)
                : selectedSetting === "subjects" ?
                  (<GroupSettings>
                    <GroupList>
                      <ListHead>
                        <h4>Список причин:</h4>
                        <AddButton  onClick={() => newRecord('subjects')}>Новий запис</AddButton >
                      </ListHead>
                      {subjects.map((subject) => (
                        <GroupItem
                          key={subject.id}
                          onClick={() => setSelectedSubject(subject)}
                          selected={selectedSubject?.id === subject.id}
                        >
                          {subject.name}
                        </GroupItem>
                      ))}
                    </GroupList>
                  </GroupSettings>)
                : (
                <Placeholder>🔧 Оберіть налаштування зліва</Placeholder>
              )}
        </DetailsSection>
        <DetailsSection>
            {selectedSetting === "groups" && selectedGroup ? (
              <GroupEditor>
                <h4>Редагування групи: {selectedGroup.title}</h4>
                <Input
                  type="text"
                  value={selectedGroup.title}
                  onChange={(e) =>
                    setSelectedGroup({ ...selectedGroup, title: e.target.value })
                  }
                  placeholder="Абривіатура"
                />
                <Input
                  type="text"
                  value={selectedGroup.description}
                  onChange={(e) =>
                    setSelectedGroup({
                      ...selectedGroup,
                      description: e.target.value,
                    })
                  }
                  placeholder="Розшифровка"
                />
                <TextArea
                  rows={4}
                  value={selectedGroup.statement_head_text}
                  onChange={(e) =>
                    setSelectedGroup({
                      ...selectedGroup,
                      statement_head_text: e.target.value,
                    })
                  }
                  placeholder="Текст заголовка заяви"
                />
                <FileInput
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                />
                <SaveButton onClick={handleGroupSave}>💾 Зберегти</SaveButton>
              </GroupEditor>
              ) : selectedSetting === "reasons" && selectedReason ? 
                <GroupEditor>
                  <h4>Редагування причини: {selectedReason.title}</h4>
                  <Input
                    type="text"
                    value={selectedReason.title}
                    onChange={(e) =>
                      setSelectedReason({ ...selectedReason, title: e.target.value })
                    }
                  />
                  <div>
                    <p>у звязку з - </p>
                    <Input
                      type="text"
                      value={selectedReason.description}
                      onChange={(e) =>
                        setSelectedReason({
                          ...selectedReason,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <SaveButton onClick={handleReasonSave}>💾 Зберегти</SaveButton>
                </GroupEditor> : selectedSetting === "users" && selectedUser ? 
                <GroupEditor>
                  <h4>Редагування користувача: {selectedUser.first_name + " " + selectedUser.last_name}</h4>
                  <p>Ім'я - </p>
                  <Input
                    type="text"
                    value={selectedUser.first_name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, first_name: e.target.value })
                    }
                  />
                  <div>
                    <p>Прізвище - </p>
                    <Input
                      type="text"
                      value={selectedUser.last_name}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <p>Роль - </p>
                    <select
                      value={selectedUser.type}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          type: e.target.value,
                        })
                      }
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        outline: "none",
                        margin: "0 0 20px 0"
                      }}
                    >
                      <option value="Student">🧑‍🎓 Студент</option>
                      <option value="Admin">👨‍💼 Адмін</option>
                      <option value="Teacher">👩‍🏫 Викладач</option>
                    </select>
                  </div>
                  { selectedUser.type == 'Teacher' &&
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedUser.grand_teacher}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            grand_teacher: e.target.checked,
                          })
                        }
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          fontSize: "14px",
                          outline: "none",
                          margin: "0 0 20px 0"
                        }}
                      />
                      &nbsp; 👑 Зам. кафедри
                    </label>
                  </div>
                  }
                  <SaveButton onClick={handleUserSave}>💾 Зберегти</SaveButton>
                </GroupEditor> : selectedSetting === "subjects" && selectedSubject ?
                  <GroupEditor>
                    <h4>Редагування предмету: {selectedSubject.name}</h4>
                    <div>
                      
                      <Input
                        type="text"
                        value={selectedSubject.name}
                        onChange={(e) =>
                          setSelectedSubject({ ...selectedSubject, name: e.target.value })
                        }
                        placeholder="Назва предмету"
                      />
                    </div>
                    <div>
                      <p></p>
                      <Input
                        type="number"
                        value={selectedSubject.hours_count}
                        onChange={(e) =>
                          setSelectedSubject({
                            ...selectedSubject,
                            hours_count: e.target.value,
                          })
                        }
                        placeholder="К-сть годин"
                      />
                    </div>
                    <p></p>
                    <SaveButton onClick={handleSubjectSave}>💾 Зберегти</SaveButton>
                  </GroupEditor>
                :
                (
                  <Placeholder>🔍 Оберіть запис для редагування</Placeholder>
                )}
          </DetailsSection>
      </Wrapper>
    </Container>
  )
};

const SettingItem = styled.div<{ selected?: boolean }>`
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

const AddButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer
`;

const GroupSettings = styled.div`
  display: flex;
  gap: 20px;
`;

const GroupList = styled.div`
  flex: 1;
  background: #fafafa;
  border-radius: 10px;
  padding: 15px;
`;

const GroupItem = styled.div<{ selected?: boolean }>`
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

const GroupEditor = styled.div`
  flex: 2;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const FileInput = styled.input`
  margin-bottom: 15px;
`;

const SaveButton = styled.button`
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

const Placeholder = styled.div`
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-top: 100px;
`;

const ListHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
`;


// ---------- Styled Components ----------

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
