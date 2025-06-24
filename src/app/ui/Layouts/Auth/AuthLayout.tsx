import { ReactElement } from 'react';
import * as S from './AuthLayout.styles';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <S.Root>
      <Outlet />
    </S.Root>
  );
};