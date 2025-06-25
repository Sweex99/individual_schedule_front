import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { getAllSubjects } from "../../../../../Services/SubjectService";
import { DeclineTeacher, SubmitTeacher } from "../../../../../Services/RequestService";
import AsyncSelect from "react-select/async";
import { StylesConfig } from 'react-select';
import { getTeachers } from "../../../../../Services/UsersService";
import ModalWindow from "../../../../../Components/ModalWindow/ModalWindow";
import { FirstStep } from "../FirstStep/FirstStep";

interface Subject {
  id: number;
  name: string;
  hours_count: string;
  teachers: { id: number; first_name: string; last_name: string }[];
}

export const FourthStep = (currentRequest: any) => {
  const [rows, setRows] = useState<{
    hours_count: string;
    id: number;
    subject_id: string;
    teacher_id: string;
    comment: string | null;
    state: string | null;
    options3: { id: number; first_name: string; last_name: string }[];
    subject_label: string;
  }[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState<string | null>("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const preparedRows = currentRequest.currentRequest.subjects_teachers.map((st: any) => ({
          id: st.id,
          subject_id: st.subject.id,
          teacher_id: st.teacher.id,
          hours_count: st.subject.hours_count,
          comment: st.comment,
          state: st.state,
          options3: [st.teacher],
          subject_label: `${st.subject.name} (${st.subject.hours_count} год)`
        }));

        setRows(preparedRows);
      } catch (error) {
        console.error("Помилка завантаження предметів: ", error);
      }
    };

    fetchSubjects();
  }, []);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), subject_id: "", teacher_id: "", hours_count: "", comment: "", state: "", options3: [], subject_label: "" }]);
  };

  const deleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleChange = (id: number, column: "subject_id" | "teacher_id", value: string) => {
    setRows(rows.map((row) => {
      if (row.id === id) {
        if (column === "subject_id") {
          const selectedSubject = subjects.find((subj) => subj.id === Number(value));
          return {
            ...row,
            subject_id: value,
            teacher_id: "",
            hours_count: selectedSubject ? selectedSubject?.hours_count : "",
            options3: selectedSubject ? selectedSubject.teachers : [],
          };
        } else {
          return { ...row, teacher_id: value };
        }
      }
      return row;
    }));
  };

  const handleSubmitTeacher = async (rowId: number) => {
    const selectedRow = rows.find((row) => row.id === rowId);
    if (!selectedRow) return;

    const requestData = {
      subject_id: Number(selectedRow.subject_id),
      teacher_id: Number(selectedRow.teacher_id),
      request_id: Number(currentRequest.currentRequest.id)
    };

    try {
      await SubmitTeacher(requestData);
      alert("Дані успішно відправлено! ✅");
    } catch (error) {
      console.error("Помилка надсилання даних:", error);
      alert("Помилка надсилання даних ❌");
    }
  };

  const handleDeclineTeacher  = async (rowId: number) => {
    debugger;
    const selectedRow = rows.find((row) => row.id === rowId);
    if (!selectedRow) return;

    try {
      await DeclineTeacher(rowId);
      deleteRow(rowId);
      alert("Дані успішно відправлено! ✅");
    } catch (error) {
      console.error("Помилка надсилання даних:", error);
      alert("Помилка надсилання даних ❌");
    }
  };

  const colourStyles: StylesConfig<any> = {
    control: (styles: any) => ({ ...styles, minWidth: "200px" }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <Container>
      <Title>📌 Оберіть предмети та викладачів</Title>
        {rows.map((row) => (
          <TableWrapper>
            Виберіть Предмет
            <AsyncSelect
              cacheOptions
              isClearable
              defaultOptions={subjects.map((t: any) => ({
                value: t.id,
                label: `${t.name} (${t.hours_count} год)`,
                color: "blue"
              }))}
              defaultValue={{
                value: row.subject_id,
                label: row.subject_label
              }}
              isDisabled={row.state === "approved" || row.state === "rejected"}
              loadOptions={async (inputValue: any) => {
                try {
                  const subjects = await getAllSubjects(inputValue, currentRequest.currentRequest.id);
                  return subjects.map((t: any) => ({
                    value: t.id,
                    label: `${t.name} (${t.hours_count} год)`,
                  }));
                } catch (error) {
                  console.error("Помилка пошуку викладачів:", error);
                  return [];
                }
              }}
              styles={colourStyles}
              menuPortalTarget={document.body}
              onChange={(selectedOption: any) => {
                handleChange(row.id, "subject_id", selectedOption?.value || "");
              }}
            />
            Виберіть Викладача
            <AsyncSelect
              cacheOptions
              isClearable
              defaultOptions={row.options3.map((t: any) => ({
                value: t.id,
                label: `${t.first_name} ${t.last_name}`,
                color: "blue"
              }))}
              defaultValue={{
                value: row.teacher_id,
                label: `${ row.options3[0]?.first_name || ''} ${row.options3[0]?.last_name || ''}`
              }}
              isDisabled={row.state === "approved" || row.state === "rejected"}
              loadOptions={async (inputValue: any) => {
                if (!inputValue) return [];
                try {
                  const teachers = await getTeachers(inputValue);
                  return teachers.map((t: any) => ({
                    value: t.id,
                    label: `${t.first_name} ${t.last_name}`,
                  }));
                } catch (error) {
                  console.error("Помилка пошуку викладачів:", error);
                  return [];
                }
              }}
              styles={colourStyles}
              menuPortalTarget={document.body}
              onChange={(selectedOption: any) => {
                handleChange(row.id, "teacher_id", selectedOption?.value || "");
              }}
            />
            <AddButton onClick={() => { handleSubmitTeacher(row.id) }}>Прийняти</AddButton>
            <DeleteButton onClick={() => { handleDeclineTeacher(row.id) }}>Відхілити</DeleteButton>
            {row?.comment !== '' ? (
                <SubmitButton onClick={() => { setComment(row?.comment); setModalOpen(true); }}>
                  Коментар
                </SubmitButton>
              ) : null}
            <ModalWindow isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
              <Container>
                {comment}
              </Container>
            </ModalWindow>
        </TableWrapper>
        ))}
      <AddButton onClick={addRow}>➕ Додати рядок</AddButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  gap: 30px;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: white;
  padding: inherit;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
`;

const TableRowHeader = styled.tr`
  background: #222;
  color: white;
`;

const TableRow = styled.tr`
  background: white;
  transition: background 0.3s ease;

  &:nth-child(even) {
    background: "#f8f8f8";
  }

  &:hover {
    background: #e0e0e0;
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
`;

const TableCellCenter = styled(TableCell)`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    border-color: #888;
  }
`;

const DeleteButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #d32f2f;
  }
`;

const SubmitButton = styled.button`
  background: rgb(78, 119, 207);
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;

`;

const AddButton = styled.button`
  margin-top: 15px;
  background: #4caf50;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #388e3c;
  }
`;

