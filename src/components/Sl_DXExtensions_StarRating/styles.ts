import styled, { css } from 'styled-components';
import { defaultThemeProp } from '@pega/cosmos-react-core';

const StyledStarWrapper = styled.div(({ theme }) => {

  return css`
    color: ${theme.components.rating.color}
    display: inline-flex;
    .star {
      height: 2rem;
      width: 2rem;
      transition: all 0.2s ease-in-out;
      transform-origin: center;
    }
    .star:hover:not(.disabled):not(.readonly) {
      transform: scale(1.2);
    }
  `;
});

StyledStarWrapper.defaultProps = defaultThemeProp;

const StyledStarRatingMetaInfo = styled.div(props => {
  const { theme } = props;
  return css`
    padding-block: ${theme.base.spacing};
    margin-inline-start: ${theme.base.spacing};
  `;
});

StyledStarRatingMetaInfo.defaultProps = defaultThemeProp;

export { StyledStarWrapper, StyledStarRatingMetaInfo };
