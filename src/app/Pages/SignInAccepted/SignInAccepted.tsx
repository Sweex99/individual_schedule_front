import { useEffect } from "react";
import apiClient from "../../unitilies/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

interface User {
  id: number,
  email: string,
  first_name: string,
  last_name: string
}

export const SignInAccepted = () => {
  const [searchParams] = useSearchParams();
  const { acceptUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("accessToken") || "";

    const fetchData = async () => {
      try {
        acceptUser(token);
      } catch (error) {
        console.error("Error during sign-in request:", error);
      }
    };

    fetchData(); // викликаємо асинхронну функцію

    // Можна повернути clean-up функцію, якщо потрібно
    return () => {
      // clean-up код, якщо він необхідний
    };
  }, []); // Порожній масив залежностей, щоб викликався тільки при монтуванні компонента

  return <></>;
};

