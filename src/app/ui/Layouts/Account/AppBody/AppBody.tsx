import { ReactElement } from 'react';
import * as S from './AppBody.styles';

export const AppBody: React.FC<AppBodyProps> = ({ children }) => {
  return (
    <S.Root>
      {children}
    </S.Root>
  );
}

export type AppBodyProps = {
  children: ReactElement;
};
