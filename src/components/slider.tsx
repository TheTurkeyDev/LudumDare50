import { BaseTheme } from '@theturkeydev/gobble-lib-react';
import styled, { css, ThemeProps } from 'styled-components';

const trackH = '25px';
const thumbD = '25px';
const trackC = '#ccced0';

const track = css`
  box-sizing: border-box;
  border: none;
  height: 20px;
  background: ${trackC};
  border-radius: 8px;
`;

const trackFill = css`
    ${track};
    height: ${trackH};
    background-color: transparent;
    background-image: linear-gradient(${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.color}, ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.color}),
    linear-gradient(${trackC}, ${trackC});
    background-size: var(--sx)  ${trackH}, calc(100% - var(--sx))  ${trackH};
    background-position: left center, right center;
    background-repeat: no-repeat;
    border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineLowered};
`;

const fill = css`
  height: ${trackH};
  background: ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.color};
  border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineLowered};
  border-radius: 4px;
`;

const thumb = css`
  box-sizing: border-box;
  border: none;
  width: ${thumbD};
  height: ${thumbD};
  border-radius: 50%;
  background: ${({ theme }: ThemeProps<BaseTheme>) => theme.primary.color};
  box-shadow: 0px 0px 5px rgba(66, 97, 255, 0.5);
`;

export const Slider = styled.input`
    width: 100%;

    &,
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:focus::-moz-range-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:focus::-ms-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--val) - var(--min)) / var(--range));
  --sx: calc(0.5 * ${thumbD} + var(--ratio) * (100% - ${thumbD}));

  margin: 0;
  padding: 0;
  height: ${thumbD};
  background: transparent;
  font: 1em/1 arial, sans-serif;

  &::-webkit-slider-runnable-track {
    ${trackFill};
  }

  &::-moz-range-track {
    ${track};
  }

  &::-ms-track {
    ${track};
  }

  &::-moz-range-progress {
    ${fill};
  }

  &::-ms-fill-lower {
    ${fill};
  }

  &::-webkit-slider-thumb {
    margin-top: calc(0.5 * (${trackH} - ${thumbD}));
    ${thumb};
  }

  &::-moz-range-thumb {
    ${thumb};
  }

  &::-ms-thumb {
    margin-top: 0;
    ${thumb};
  }

  &::-ms-tooltip {
    display: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }
`;