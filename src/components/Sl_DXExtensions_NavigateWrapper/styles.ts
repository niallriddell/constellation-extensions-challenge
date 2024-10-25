import styled, { css } from 'styled-components';
import { type themeDefinition, SummaryItem } from '@pega/cosmos-react-core';

export default styled(SummaryItem)(
  ({ theme }: { theme: typeof themeDefinition }) => css`
    padding-block: ${theme.base.spacing};

    & {
      border-block-end: 0.0625rem solid ${theme.base.palette['border-line']};
    }
  `
);
