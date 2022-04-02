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

export const TypeChallenege = ({ challengesCompleted }: MathChallenegeProps) => {

    const { onChallengeComplete, addTime } = useGame();

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [word, setWord] = useState('');

    const generateWord = () => {
        const length = 3 + Math.floor(challengesCompleted / 3);
        setLoading(true);
        fetch(`https://api.theturkey.dev/randomword?length=${length}`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        })
            .then(resp => resp.text()).then(word => {
                setWord(word);
                setLoading(false);
            }).catch(() => {
                setWord('problem');
                setLoading(false);
            });
    };

    useEffect(() => {
        generateWord();
    }, []);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading)
            return false;

        if (input === word) {
            addTime(10);
            onChallengeComplete(Challenge.TypeCallenge);
        }
        else {
            generateWord();
            addTime(-5);
        }
        return false;
    };

    return (
        <ContentWrapper>
            <form onSubmit={onSubmit}>
                <ChallenegeBox>
                    <Headline5>
                        <u>
                            Please type in the given word
                        </u>
                    </Headline5>
                    <Headline6>
                        {loading ?
                            'Loading Word....'
                            : word
                        }
                    </Headline6>
                    <input type='text' value={input} onChange={e => setInput(e.target.value)} />
                    <ContainedButton type='submit'>Submit</ContainedButton>
                </ChallenegeBox>
            </form>
        </ContentWrapper>
    );
};