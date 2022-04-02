import { BaseTheme, Elevation, Input, TopLabeled } from '@theturkeydev/gobble-lib-react';
import { createRef, useEffect, useState } from 'react';
import styled, { ThemeProps } from 'styled-components';
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
    width: 500px;
    height: 200px;
    background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.surface.color};
    border: 1px solid ${({ theme }: ThemeProps<BaseTheme>) => theme.inputs.outlineRaised};
    box-shadow: ${Elevation.lowest};
    border-radius: 5px;

    display: grid;
    grid-template-rows: 100px 1fr;
    padding: 8px 16px;
    align-items: center;
    gap: 16px;
`;

const TextContent = styled.canvas`
    background-color: white;
    border-radius: 5px;
    width: 100%;
    height: 100%;
`;

const InputContent = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 16px;
`;

const CaptchaInput = styled.input`
    text-transform: uppercase;
`;

const ReloadIcon = styled.i`
    font-size: 24px;

    &:hover {
        cursor: pointer;
    }
`;

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 100;

type WordInputCaptchaProps = {
    readonly challengesCompleted: number
}
export const WordInputCaptcha = ({ challengesCompleted }: WordInputCaptchaProps) => {
    const canvas = createRef<HTMLCanvasElement>();
    const [shownLetters, setShownLetters] = useState('');
    const { addTime, onChallengeComplete } = useGame();

    const lettersToUse = Math.min(9, 3 + Math.floor(challengesCompleted / 2));
    const linesToUse = 5 + challengesCompleted;

    useEffect(() => {
        reloadCanvasContent();
    }, []);

    const reloadWords = () => {
        addTime(-50);
        reloadCanvasContent();
    };

    const onInputChange = (input: string) => {
        if (input.toUpperCase() === shownLetters) {
            addTime(100);
            onChallengeComplete(Challenge.WordInputCaptcha);
        }
    };

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const colors = ['red', 'green', 'aqua', 'blue', 'blueviolet', 'black', 'purple', 'cyan', 'darkmagenta', 'orange', 'navy'];

    const reloadCanvasContent = () => {
        const c = canvas.current;
        const ctx = c?.getContext('2d');
        if (!c || !ctx)
            return;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = 'bolder 30px Arial';
        ctx.textAlign = 'center';
        ctx.translate(25, 50);

        const letters = Array(lettersToUse);
        // eslint-disable-next-line functional/no-let
        for (let i = 0; i < lettersToUse; i++) {
            letters[i] = drawRandomLetter(ctx, 25 + (50 * i));
        }
        setShownLetters(letters.join(''));
        ctx.translate(-25, -50);

        // eslint-disable-next-line functional/no-let
        for (let i = 0; i < linesToUse; i++) {
            drawRandomDot(ctx);
            drawRandomLine(ctx);
            drawRandomDot(ctx);
        }
    };

    const drawRandomLetter = (ctx: CanvasRenderingContext2D, xOff: number) => {
        const letter = chars[Math.floor(Math.random() * chars.length)];
        ctx.translate(xOff, 0);
        const rot = (Math.random() * (Math.PI / 2)) - (Math.PI / 4);
        ctx.rotate(rot);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(letter, 0, 0);
        ctx.fillStyle = 'black';
        ctx.rotate(-rot);
        ctx.translate(-xOff, 0);
        return letter;
    };

    const drawRandomLine = (ctx: CanvasRenderingContext2D) => {
        const x1 = Math.random() * CANVAS_WIDTH;
        const x2 = Math.random() * CANVAS_WIDTH;
        const y1 = Math.random() * CANVAS_HEIGHT;
        const y2 = Math.random() * CANVAS_HEIGHT;
        ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.strokeStyle = 'black';
    };

    const drawRandomDot = (ctx: CanvasRenderingContext2D) => {
        const x = Math.random() * CANVAS_WIDTH;
        const y = Math.random() * CANVAS_HEIGHT;
        ctx.beginPath();
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, 2, 2);
        ctx.stroke();
    };

    return (
        <ContentWrapper>
            <CaptchaBox>
                <TextContent ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                <InputContent>
                    <CaptchaInput placeholder='Type The text' onChange={e => onInputChange(e.target.value)} />
                    <div onClick={() => reloadWords()} >
                        <ReloadIcon className='fa-solid fa-rotate' />
                    </div>
                    <UnCaptchaInfo />
                </InputContent>
            </CaptchaBox>
        </ContentWrapper >
    );
};