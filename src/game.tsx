import { useInterval } from '@theturkeydev/gobble-lib-react';
import { useEffect, useMemo, useState } from 'react';
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

export const Game = () => {

    const [shownCaptcha, setShownCaptcha] = useState(Challenge.NotARobotCaptcha);
    const [start, setStart] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [highScore, setHighScore] = useState(() => localStorage.getItem('highScore') ?? '0');

    const contextVals = useMemo(() => { return { start: startGame, addTime, onChallengeComplete }; }, []);
    const challenge = useMemo(() => getChallengeToShow(shownCaptcha, challengesCompleted), [shownCaptcha, challengesCompleted]);

    useInterval(() => {
        if (start)
            setTimeLeft(old => old - 1);
    }, 100);

    useEffect(() => {
        if (timeLeft <= 0) {
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
                return <WordInputCaptcha challengesCompleted={challengesCompleted} />;
            case Challenge.BallRollCaptcha:
                return <BallRollCaptcha />;
            case Challenge.MathCallenge:
                return <MathChallenege challengesCompleted={challengesCompleted} />;
            case Challenge.TypeCallenge:
                return <TypeChallenege challengesCompleted={challengesCompleted} />;
            case Challenge.PuzzleCaptcha:
                return <FinishPuzzleCaptcha challengesCompleted={challengesCompleted} />;
            case Challenge.ImageMultiSelectCaptcha:
                return <ImageMultiTypeCaptcha />;
            case Challenge.ImageSingleCaptcha:
                return <ImageSingleCaptcha />;
        }
    };

    function onChallengeComplete(current: number) {
        const toChoose = Object.keys(Challenge).filter(i => !isNaN(Number(i))).map(i => parseInt(i)).filter(i => i !== current && i !== 0);
        setShownCaptcha(toChoose[Math.floor(Math.random() * toChoose.length)]);
        setChallengesCompleted(old => old + 1);
    };

    return (
        <GameContext.Provider value={contextVals}>
            <HeaderBar challengesCompleted={challengesCompleted} time={timeLeft} highScore={highScore} />
            {challenge}
        </GameContext.Provider>
    );
};