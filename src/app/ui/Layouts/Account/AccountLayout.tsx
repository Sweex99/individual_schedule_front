import { Outlet } from "react-router-dom"
import { AppBody } from "./AppBody/AppBody"
import { AppHeader } from "./AppHeader/AppHeader"
import { useAuth } from "../../../Context/useAuth"
import * as S from '../Auth/AuthLayout.styles';


export const AccountLayout = () => {
  const { isLoggedIn } = useAuth();

  return(
    (isLoggedIn()) ?
      (<>
        <AppHeader />
        <AppBody >
          <Outlet />
        </AppBody>
      </>) :
      (<S.Root>
        <Outlet />
      </S.Root>)
  )
}