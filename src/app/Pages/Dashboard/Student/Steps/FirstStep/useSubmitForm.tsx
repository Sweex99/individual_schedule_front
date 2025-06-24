import { useState } from "react";
import { SubmitRequest } from "../../../../../Services/RequestService";

export const useSubmitForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitForm = async (data: any, callback: () => void) => {
    setLoading(true);
    setError(null);

    try {
      SubmitRequest(data);
      setSuccess(true);
      callback();
    } catch (err: any) {
      setError(err.message || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error, success };
};
