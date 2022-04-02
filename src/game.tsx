import { useInterval } from '@theturkeydev/gobble-lib-react';
import { useEffect, useMemo, useState } from 'react';
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

    const contextVals = useMemo(() => { return { start: startGame, addTime, onChallengeComplete }; }, []);
    const challenge = useMemo(() => getChallengeToShow(shownCaptcha, challengesCompleted), [shownCaptcha, challengesCompleted]);

    useInterval(() => {
        if (start)
            setTimeLeft(old => old - 1);
    }, 100);

    useEffect(() => {
        if (timeLeft <= 0) {
            window.location.reload();
        }
    }, [timeLeft]);


    function startGame() {
        setStart(true);
        setShownCaptcha(Challenge.BallRollCaptcha);
    };


    function addTime(amount: number) {
        setTimeLeft(old => old + amount);
    };

    function getChallengeToShow(challenge: number, challengesCompleted: number) {
        switch (challenge) {
            case Challenge.NotARobotCaptcha:
                return <NotARobotCheckBox />;
            case Challenge.WordInputCaptcha:
                return <WordInputCaptcha challengesCompleted={challengesCompleted} />;
            case Challenge.BallRollCaptcha:
                return <BallRollCaptcha />;
        }
    };

    function onChallengeComplete(current: number) {
        const toChoose = Object.keys(Challenge).filter(i => !isNaN(Number(i))).map(i => parseInt(i)).filter(i => i !== current && i !== 0);
        setShownCaptcha(toChoose[Math.floor(Math.random() * toChoose.length)]);
        setChallengesCompleted(old => old + 1);
    };

    return (
        <GameContext.Provider value={contextVals}>
            <HeaderBar challengesCompleted={challengesCompleted} time={timeLeft} />
            {challenge}
        </GameContext.Provider>
    );
};