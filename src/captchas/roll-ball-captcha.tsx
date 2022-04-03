import { BaseTheme, Body1, ContainedButton, Headline5, Subtitle1 } from '@theturkeydev/gobble-lib-react';
import { useState } from 'react';
import styled, { keyframes, ThemeProps } from 'styled-components';
import { Challenge } from '../challenges-enum';
import { useGame } from '../game-context';
import { ContentBox, ContentWrapper } from '../styles/styles';
import { UnCaptchaInfo } from './un-captcha-info';

const CaptchaBox = styled(ContentBox)`
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

const Image = styled.img`
    max-width: 96px;
    max-height: 96px;
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

const images = ['./res/imgs/elephant.png', './res/imgs/penguin.png'];

type BallRollCaptchaProps = {
    readonly challengesCompleted: number
    readonly offset: string
}

export const BallRollCaptcha = ({ challengesCompleted, offset }: BallRollCaptchaProps) => {
    const { onChallengeComplete, addTime } = useGame();

    const rot = Math.random() * 360;
    const adjRot = rot - (rot % 20);
    const [rotation, setRotation] = useState(adjRot);
    const [bounce, setBounce] = useState(false);
    const [wrong, setWrong] = useState(false);
    const [totalToComplete, setTotalToComplete] = useState(() => 1 + Math.floor(challengesCompleted / 8));
    const [completed, setCompleted] = useState(0);

    const [animalImage, setAnimalImage] = useState(() => images[Math.floor(Math.random() * images.length)]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (rotation % 360 === 0) {
            if (completed + 1 === totalToComplete) {
                addTime(3);
                onChallengeComplete(Challenge.BallRollCaptcha);
            }
            else {
                setCompleted(old => old + 1);
                randomRotate();
            }
        }
        else {
            setWrong(true);
            addTime(-10);
            randomRotate();
        }
    };

    const randomRotate = () => {
        const rot = Math.random() * 360;
        const adjRot = rot - (rot % 20);
        setRotation(adjRot);
        setAnimalImage(images[Math.floor(Math.random() * images.length)]);
    };

    const rotate = (ammount: number) => {
        setBounce(true);
        setRotation(old => old + ammount);
    };

    return (
        <ContentWrapper>
            <form onSubmit={onSubmit}>
                <CaptchaBox width={400} height={300} offset={offset}>
                    <Header>
                        <Headline5>Touch the Arrows</Headline5>
                        <Subtitle1>to roll the ball</Subtitle1>
                    </Header>
                    <TopContent>
                        <ArrowIcon className='fa-solid fa-arrow-rotate-right' justify='end' onClick={() => rotate(20)} />
                        <div className={bounce ? 'bounce' : ''} onAnimationEnd={() => setBounce(false)}>
                            <Ball rotation={rotation}>
                                <Image src={animalImage} />
                            </Ball>
                        </div>
                        <ArrowIcon className='fa-solid fa-arrow-rotate-left' justify='start' onClick={() => rotate(-20)} />
                    </TopContent>
                    <BottomContent>
                        <Headline5>{completed + 1} of {totalToComplete}</Headline5>
                        <ContainedButton className={wrong ? 'wrong' : ''} onAnimationEnd={() => setWrong(false)} type='submit'>Submit</ContainedButton>
                        <UnCaptchaInfo />
                    </BottomContent>
                </CaptchaBox>
            </form>
        </ContentWrapper>
    );
};