import { ContainedButton, Headline5, Headline6 } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Challenge } from '../challenges-enum';
import { useGame } from '../game-context';
import { ContentWrapper, ContentBox } from '../styles/styles';


const ChallenegeBox = styled(ContentBox)`
    width: 400px;
    height: 150px;

    display: grid;
    grid-template-rows: auto;
    padding: 8px 16px;
    align-items: center;
    justify-items: center;
    gap: 8px;
`;

type MathChallenegeProps = {
    readonly challengesCompleted: number
}

function generateRandNumber(challengesCompleted: number) {
    return Math.floor(5 + (Math.random() * ((5 * challengesCompleted) - 5)));
};

export const MathChallenege = ({ challengesCompleted }: MathChallenegeProps) => {

    const { onChallengeComplete, addTime } = useGame();

    const [input, setInput] = useState('');
    const [num1, setNum1] = useState(generateRandNumber(challengesCompleted));
    const [num2, setNum2] = useState(generateRandNumber(challengesCompleted));

    const generateMath = () => {
        setNum1(generateRandNumber(challengesCompleted));
        setNum2(generateRandNumber(challengesCompleted));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (parseInt(input) === num1 + num2) {
            addTime(5);
            onChallengeComplete(Challenge.MathCallenge);
        }
        else {
            generateMath();
            addTime(-10);
        }
    };

    return (
        <ContentWrapper>
            <form onSubmit={onSubmit}>
                <ChallenegeBox>
                    <Headline5>
                        <u>
                            Please solve the math equation
                        </u>
                    </Headline5>
                    <Headline6>
                        {num1} + {num2}
                    </Headline6>
                    <input type='number' placeholder='answer' value={input} onChange={e => setInput(e.target.value)} />
                    <ContainedButton type='submit'>Submit</ContainedButton>
                </ChallenegeBox>
            </form>
        </ContentWrapper>
    );
};