import { ContainedButton, Headline5, Headline6 } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Challenge } from '../challenges-enum';
import { useGame } from '../game-context';
import { ContentWrapper, ContentBox } from '../styles/styles';


const ChallenegeBox = styled(ContentBox)`
    display: grid;
    grid-template-rows: auto;
    padding: 8px 16px;
    align-items: center;
    justify-items: center;
    gap: 8px;
`;

type MathChallenegeProps = {
    readonly challengesCompleted: number
    readonly offset: string
}

function generateRandNumber(challengesCompleted: number) {
    return Math.floor(Math.random() * 10);
};

function generateMath(completed: number) {
    return Array.from({ length: 2 + Math.floor(completed / 8) }, () => generateRandNumber(completed));
}

export const MathChallenege = ({ challengesCompleted, offset }: MathChallenegeProps) => {

    const { onChallengeComplete, addTime } = useGame();

    const [input, setInput] = useState('');
    const [numbers, setNumbers] = useState(() => generateMath(challengesCompleted));
    const [wrong, setWrong] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (parseInt(input) === numbers.reduce((prev, current) => prev + current, 0)) {
            addTime(3);
            onChallengeComplete(Challenge.MathCallenge);
        }
        else {
            setWrong(true);
            setNumbers(generateMath(challengesCompleted));
            addTime(-10);
            setInput('');
        }
    };

    return (
        <ContentWrapper>
            <form onSubmit={onSubmit}>
                <ChallenegeBox width={400} height={150} offset={offset}>
                    <Headline5>
                        <u>
                            Please solve the math equation
                        </u>
                    </Headline5>
                    <Headline6> {numbers.join(' + ')} </Headline6>
                    <input type='number' placeholder='answer' value={input} onChange={e => setInput(e.target.value)} />
                    <ContainedButton className={wrong ? 'wrong' : ''} onAnimationEnd={() => setWrong(false)} type='submit'>Submit</ContainedButton>
                </ChallenegeBox>
            </form>
        </ContentWrapper>
    );
};