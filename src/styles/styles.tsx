import { BaseTheme, Elevation } from '@theturkeydev/gobble-lib-react';
import styled, { ThemeProps } from 'styled-components';

export const ContentWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

type ContentBoxProps = {
    readonly width: number
    readonly height: number
    readonly offset: string
}
export const ContentBox = styled.div<ContentBoxProps>`
    background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.surface.color};
    border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineRaised};
    box-shadow: ${Elevation.lowest};
    border-radius: 5px;
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    position: absolute;
    top: calc(${({ offset }) => offset} - ${({ height }) => height / 2}px);
    left: calc(${({ offset }) => offset} - ${({ width }) => width / 2}px);
`;

export function getRandOffset(completed: number) {
    const mult = Math.min(completed / 10, 1) * 60;
    const offSet = (Math.random() * mult) - (mult / 2);
    return `${50 - offSet}% `;
}