import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Root = styled('div') (
  () => css`
    display: flex;
    height: 90vh;
    width: 100%;
    justify-content: center;
    background-color: #f4f6f8;
  `,
);
