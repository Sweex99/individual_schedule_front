import { useAuth } from "../../Context/useAuth";
import { TeacherDashboard } from "./Teacher/TeacherDashboard";
import { AdminDashboard } from "./Admin/AdminDashboard";
import { StudentDashboard } from "./Student/StudentDashboard";

export const Dashboard = () => {
  const currentUser = useAuth();

  return (
    <>
      {currentUser?.user?.type === "Admin" ? (
        <AdminDashboard />
      ) : currentUser?.user?.type === "Teacher" ? (
        <TeacherDashboard />
      ) : currentUser?.user?.type === "Student" ? (
        <StudentDashboard />
      ) : (
        <p>Невідома роль користувача</p>
      )}
    </>
  );  
};
