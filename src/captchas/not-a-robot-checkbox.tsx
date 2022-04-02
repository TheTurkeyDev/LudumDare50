import { BaseTheme, Body1 } from '@theturkeydev/gobble-lib-react';
import styled, { ThemeProps } from 'styled-components';
import { useGame } from '../game-context';
import { ContentBox, ContentWrapper } from '../styles/styles';
import { UnCaptchaInfo } from './un-captcha-info';

const CaptchaBox = styled(ContentBox)`
    width: 400px;
    height: 100px;

    display: grid;
    grid-template-columns: auto 1fr auto;
    padding: 8px 16px;
    align-items: center;
    gap: 16px;
`;

const CheckBox = styled.div`
    background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.background.color};
    border: 2px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineRaised};
    border-radius: 2px;
    width: 25px;
    height: 25px;

    &:hover {
        cursor: pointer;
    }
`;

export const NotARobotCheckBox = () => {

    const { start } = useGame();

    return (
        <ContentWrapper>
            <CaptchaBox>
                <CheckBox onClick={() => start()}></CheckBox>
                <Body1>I'm not a robot</Body1>
                <UnCaptchaInfo />
            </CaptchaBox>
        </ContentWrapper>
    );
};