import { BaseTheme, Body1, Headline3, Headline5 } from '@theturkeydev/gobble-lib-react';
import styled, { ThemeProps } from 'styled-components';
import { useGame } from '../game-context';
import { ContentBox, ContentWrapper } from '../styles/styles';
import { UnCaptchaInfo } from './un-captcha-info';

const StyledContentWrapper = styled(ContentWrapper)`
    max-width: 900px;
    margin-inline: auto;
    grid-template-rows: 1fr 1fr;
`;

const CaptchaBox = styled(ContentBox)`
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

const TextWrapper = styled.div`
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 16px;
`;

const Title = styled.div`
    text-align: center;
`;

export const NotARobotCheckBox = () => {
    const { start } = useGame();

    return (
        <StyledContentWrapper>
            <TextWrapper>
                <Title>
                    <Headline3>Welcome to <u>I'm Not A Robot</u>!</Headline3>
                    <Headline5>A game made in 48 hours for Ludum Dare 50</Headline5>
                </Title>
                <Body1>
                    We've all been there, and we all know the pain when we see a dreaded
                    Captcha pop up on our screen. Yet another check to make sure we aren't
                    a bot. Alas, Captchas seem to be here to stay and new versions
                    seem to pop up all the time, but what if we could make completing
                    Captchas fun? Well that's probably not possible, but I have attempted
                    to do that nonetheless! In this game your whole objective is to
                    correctly answer and complete as many captcha and verification challenge
                    questions as you can. Only stipulation is that you have 30 seconds to do
                    it. Well maybe not quite 30 seconds as every time you answer one right
                    you will have time added to the timer. Get one wrong however and you will
                    have time deducted from the timer! When the timer reaches 0, the page will
                    refresh and you'll start right back here! So how many can you complete?
                </Body1>
                <Body1>
                    Verify that you aren't a bot below to begin...
                </Body1>
            </TextWrapper>
            <CaptchaBox width={350} height={100} offset='50%'>
                <CheckBox onClick={() => start()} />
                <Body1>I'm not a robot</Body1>
                <UnCaptchaInfo />
            </CaptchaBox>
        </StyledContentWrapper>
    );
};