import { BaseTheme, Elevation } from '@theturkeydev/gobble-lib-react';
import styled, { ThemeProps } from 'styled-components';

export const ContentWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
`;

export const ContentBox = styled.div`
    background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.surface.color};
    border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineRaised};
    box-shadow: ${Elevation.lowest};
    border-radius: 5px;
`;