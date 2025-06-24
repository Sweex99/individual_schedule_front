import { FC, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Container,
  FormContainer,
  FieldContainer,
  Con,
  TwoColumnLayout,
  LeftColumn,
  RightColumn,
  SubmitButton,
} from "./FirstStep.styles";
import { useSubmitForm } from "./useSubmitForm";
import { DragAndDrop } from "../../../../../Components/DragAndDrop/DragAndDrop";
import { getGroups } from "../../../../../Services/GroupService";
import { getReasons } from "../../../../../Services/ReasonService";
import { Group } from "../../../../../Models/Group";
import { Reason } from "../../../../../Models/Reason";
import { useAuth } from "../../../../../Context/useAuth";

interface Inputs {
  hireDocument: FileList;
  semester: string;
  gender: string;
  group: number;
  reason: string;
}

interface FirstStepType {
  formState: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FirstStep: FC<FirstStepType> = ({ formState }) => {
  const currentUser = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();
  const { submitForm, loading, error } = useSubmitForm();
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const groups = await getGroups();
      setGroups(groups);

      const reasons = await getReasons();
      setReasons(reasons);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser?.user) {
      reset({
        semester: String(currentUser?.user?.semester),
        gender: currentUser?.user?.gender,
        group: currentUser?.user?.group?.id,
      });
    }
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!fileObject) {
      alert("Будь ласка, виберіть файл перед відправкою!");
      return;
    }

    const formData = new FormData();
    formData.append("request[hire_document]", fileObject);
    formData.append("request[student][semester]", data.semester);
    formData.append("request[student][gender]", data.gender);
    formData.append("request[student][group_id]", String(data.group));
    formData.append("request[reason_id]", data.reason);

    await submitForm(formData, () => {
      window.location.reload();
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <TwoColumnLayout>
            <LeftColumn>
              <FieldContainer>
                <label>Файл підтвердження найму</label>
                <DragAndDrop
                  fieldName="hireDocument"
                  description="Закріпіть файл підтверджуючий найм"
                  setFileObject={setFileObject}
                />
              </FieldContainer>
            </LeftColumn>

            <RightColumn>
              <FieldContainer>
                <label>Семестр</label>
                <select {...register("semester")} className="form-input">
                  <option value="">Оберіть семестр</option>
                  {[...Array(8)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </FieldContainer>

              <FieldContainer>
                <label>Стать</label>
                <select {...register("gender")} className="form-input">
                  <option value="">Оберіть стать</option>
                  <option value="male">Чоловіча</option>
                  <option value="female">Жіноча</option>
                </select>
              </FieldContainer>

              <FieldContainer>
                <label>Група</label>
                <select {...register("group")} className="form-input">
                  <option value="">Оберіть групу</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.title}
                    </option>
                  ))}
                </select>
              </FieldContainer>

              <FieldContainer>
                <label>Причина подачі заяви</label>
                <select {...register("reason")} className="form-input">
                  <option value="">Оберіть причину</option>
                  {reasons.map((reason) => (
                    <option key={reason.id} value={reason.id}>
                      {reason.title}
                    </option>
                  ))}
                </select>
              </FieldContainer>
            </RightColumn>
          </TwoColumnLayout>

          {error && <p className="error-message">{error}</p>}

          <Con>
            <SubmitButton
              type="submit"
              value={loading ? "Завантаження..." : "Надіслати"}
              disabled={loading}
            />
          </Con>
        </FormContainer>
      </form>
    </Container>
  );
};
