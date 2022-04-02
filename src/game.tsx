import { useInterval } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import { NotARobotCheckBox } from './captchas/not-a-robot-checkbox';
import { BallRollCaptcha } from './captchas/roll-ball-captcha';
import { WordInputCaptcha } from './captchas/word-input-captcha';
import { Challenge } from './challenges-enum';
import { GameContext } from './game-context';
import { HeaderBar } from './header-bar';

export const Game = () => {

    const [shownCaptcha, setShownCaptcha] = useState(Challenge.NotARobotCaptcha);
    const [start, setStart] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    useInterval(() => {
        if (start)
            setTimeLeft(old => old - 1);
    }, 100);

    useEffect(() => {
        if (timeLeft <= 0) {
            window.location.reload();
        }
    }, [timeLeft]);


    const startGame = () => {
        setStart(true);
        setShownCaptcha(Challenge.BallRollCaptcha);
    };


    const addTime = (amount: number) => {
        setTimeLeft(old => old + amount);
    };

    const getChallengeToShow = () => {
        switch (shownCaptcha) {
            case Challenge.NotARobotCaptcha:
                return <NotARobotCheckBox />;
            case Challenge.WordInputCaptcha:
                return <WordInputCaptcha />;
            case Challenge.BallRollCaptcha:
                return <BallRollCaptcha />;
        }
    };

    const onChallengeComplete = () => {
        const toChoose = Object.keys(Challenge).filter(i => !isNaN(Number(i))).map(i => parseInt(i)).filter(i => i !== shownCaptcha && i !== 0);
        setShownCaptcha(toChoose[Math.floor(Math.random() * toChoose.length)]);
        setChallengesCompleted(old => old + 1);
    };


    return (
        <GameContext.Provider value={{ start: startGame, addTime, onChallengeComplete }}>
            <HeaderBar challengesCompleted={challengesCompleted} time={timeLeft} />
            {
                getChallengeToShow()
            }
        </GameContext.Provider>
    );
};