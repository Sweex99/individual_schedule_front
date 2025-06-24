import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Root = styled('div')(
  () => css`
    display: flex;
    flex-direction: column;
    height: 100vh;
    weight: 100%;
    justify-content: center;
    align-items: center;
    background-color: white;
  `,
);
