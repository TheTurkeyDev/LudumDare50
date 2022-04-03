import { BaseTheme, Headline1, useInterval } from '@theturkeydev/gobble-lib-react';
import { useEffect, useMemo, useState } from 'react';
import styled, { ThemedStyledProps } from 'styled-components';
import { FinishPuzzleCaptcha } from './captchas/finish-puzzle-captcha';
import { ImageMultiTypeCaptcha } from './captchas/image-multi-type-captcha';
import { ImageSingleCaptcha } from './captchas/image-single-captcha';
import { NotARobotCheckBox } from './captchas/not-a-robot-checkbox';
import { BallRollCaptcha } from './captchas/roll-ball-captcha';
import { WordInputCaptcha } from './captchas/word-input-captcha';
import { Challenge } from './challenges-enum';
import { MathChallenege } from './challenges/math-challenge';
import { TypeChallenege } from './challenges/type-challenge';
import { GameContext } from './game-context';
import { HeaderBar } from './header-bar';
import { getRandOffset } from './styles/styles';

const GameWrapper = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    width: 100%;
    height: 100%;
`;

const GameplayArea = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const getTimeColor = (isDarkTheme: boolean, time: number) => {
    if (isDarkTheme) {
        return time > 100 ? '#03c703' : '#ff5b5b';
    }
    else {
        return time > 100 ? '#008300' : '#b70000';
    }
};

type TimeProps = {
    readonly time: number
}

const Time = styled(Headline1)`
    color: ${({ theme, time }: ThemedStyledProps<TimeProps, BaseTheme>) => getTimeColor(theme.isDarkTheme, time)};
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    text-align: center;
`;

const formatTime = (time: number) => {
    if (time < 0)
        return '0.0';
    const tenths = time % 10;
    const seconds = Math.floor((time % 600) / 10);
    const minutes = Math.floor(time / 600);
    return `${minutes === 0 ? '' : `${minutes}:`}${seconds < 10 && minutes > 0 ? `0${seconds}` : seconds}.${tenths}`;
};

export const Game = () => {
    const [shownCaptcha, setShownCaptcha] = useState(Challenge.NotARobotCaptcha);
    const [start, setStart] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [highScore, setHighScore] = useState(() => localStorage.getItem('highScore') ?? '0');
    const [offset, setOffset] = useState('50%');

    const contextVals = useMemo(() => { return { start: startGame, addTime, onChallengeComplete }; }, []);
    const challenge = useMemo(() => getChallengeToShow(shownCaptcha, challengesCompleted), [shownCaptcha, challengesCompleted]);

    useInterval(() => {
        // if (start)
        //     setTimeLeft(old => old - 1);
    }, 100);

    useEffect(() => {
        setOffset(getRandOffset(challengesCompleted));
    }, [challengesCompleted]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (challengesCompleted > parseInt(highScore))
                localStorage.setItem('highScore', challengesCompleted.toString());
            window.location.reload();
            setStart(false);
        }
    }, [timeLeft]);


    function startGame() {
        setStart(true);
        const toChoose = Object.keys(Challenge).filter(i => !isNaN(Number(i))).map(i => parseInt(i));
        setShownCaptcha(toChoose[Math.floor(Math.random() * toChoose.length)]);
        //setShownCaptcha(Challenge.ImageMultiSelectCaptcha);
    };


    function addTime(seconds: number) {
        setTimeLeft(old => old + (seconds * 10));
    };

    function getChallengeToShow(challenge: number, challengesCompleted: number) {
        switch (challenge) {
            case Challenge.NotARobotCaptcha:
                return <NotARobotCheckBox />;
            case Challenge.WordInputCaptcha:
                return <WordInputCaptcha challengesCompleted={challengesCompleted} offset={offset} />;
            case Challenge.BallRollCaptcha:
                return <BallRollCaptcha challengesCompleted={challengesCompleted} offset={offset} />;
            case Challenge.MathCallenge:
                return <MathChallenege challengesCompleted={challengesCompleted} offset={offset} />;
            case Challenge.TypeCallenge:
                return <TypeChallenege challengesCompleted={challengesCompleted} offset={offset} />;
            case Challenge.PuzzleCaptcha:
                return <FinishPuzzleCaptcha challengesCompleted={challengesCompleted} offset={offset} />;
            case Challenge.ImageMultiSelectCaptcha:
                return <ImageMultiTypeCaptcha offset={offset} />;
            case Challenge.ImageSingleCaptcha:
                return <ImageSingleCaptcha challengesCompleted={challengesCompleted} offset={offset} />;
        }
    };

    function onChallengeComplete(current: number) {
        const toChoose = Object.keys(Challenge).filter(i => !isNaN(Number(i))).map(i => parseInt(i)).filter(i => i !== current && i !== 0);
        setShownCaptcha(toChoose[Math.floor(Math.random() * toChoose.length)]);
        setChallengesCompleted(old => old + 1);
    };

    return (
        <GameContext.Provider value={contextVals}>
            <GameWrapper>
                <HeaderBar challengesCompleted={challengesCompleted} highScore={highScore} />
                <GameplayArea>
                    {shownCaptcha !== Challenge.NotARobotCaptcha && <Time time={timeLeft}>{formatTime(timeLeft)}</Time>}
                    {challenge}
                </GameplayArea>
            </GameWrapper>
        </GameContext.Provider>
    );
};