import { BaseTheme, Body1, Body2, Caption, ContainedButton, Elevation, Headline5, Overline, Subtitle1 } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import styled, { css, keyframes, ThemeProps } from 'styled-components';
import { Challenge } from '../challenges-enum';
import { useGame } from '../game-context';
import { UnCaptchaInfo } from './un-captcha-info';

const ContentWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
`;

const CaptchaBox = styled.div`
    width: 400px;
    height: 300px;
    background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.surface.color};
    border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineRaised};
    box-shadow: ${Elevation.lowest};
    border-radius: 5px;

    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 8px 16px;
    align-items: center;
    gap: 16px;
`;

const Header = styled.div`
    display: grid;
    grid-template-rows: auto auto;
    justify-items: center;
`;

const TopContent = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
`;

const BottomContent = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
`;


type BallProps = {
    readonly rotation: number
}
const Ball = styled.div<BallProps>`
    width: 128px;
    height: 128px;
    border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineRaised};
    border-radius: 64px;
    transition: 0.25s;
    transform: rotate(${({ rotation }) => rotation}deg);

    display: grid;
    justify-items: center;
    align-items: center;
`;


type ArrowIconProps = {
    readonly justify: string
}
const ArrowIcon = styled.i<ArrowIconProps>`
    font-size: 64px;
    justify-self: ${({ justify }) => justify};
    
    &:hover{
        cursor: pointer;
    }
`;

export const BallRollCaptcha = () => {

    const { onChallengeComplete, addTime } = useGame();

    const rot = Math.random() * 360;
    const adjRot = rot - (rot % 20);
    const [rotation, setRotation] = useState(adjRot);

    const onSubmit = () => {
        if (rotation % 360 === 0) {
            addTime(100);
            onChallengeComplete(Challenge.BallRollCaptcha);
        }
        else {
            addTime(-50);
            const rot = Math.random() * 360;
            const adjRot = rot - (rot % 20);
            setRotation(adjRot);
        }
    };

    const rotate = (ammount: number) => {
        setRotation(old => old + ammount);
    };

    return (
        <ContentWrapper>
            <CaptchaBox>
                <Header>
                    <Headline5>Touch the Arrows</Headline5>
                    <Subtitle1>to roll the ball</Subtitle1>
                </Header>
                <TopContent>
                    <ArrowIcon className='fa-solid fa-arrow-rotate-right' justify='end' onClick={() => rotate(20)} />
                    <Ball rotation={rotation}>
                        <Body1>Image TODO</Body1>
                    </Ball>
                    <ArrowIcon className='fa-solid fa-arrow-rotate-left' justify='start' onClick={() => rotate(-20)} />
                </TopContent>
                <BottomContent>
                    <div />
                    <ContainedButton onClick={() => onSubmit()}>Submit</ContainedButton>
                    <UnCaptchaInfo />
                </BottomContent>
            </CaptchaBox>
        </ContentWrapper>
    );
};