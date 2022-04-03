
import { ContainedButton, Subtitle1 } from '@theturkeydev/gobble-lib-react';
import { createRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Challenge } from '../challenges-enum';
import { Slider } from '../components/slider';
import { useGame } from '../game-context';
import { ContentBox, ContentWrapper } from '../styles/styles';
import { UnCaptchaInfo } from './un-captcha-info';

const CaptchaBox = styled(ContentBox)`
    display: grid;
    grid-template-rows: 200px auto 1fr;
    padding: 8px 16px;
    align-items: center;
    gap: 16px;
`;

type CanvasProps = {
    readonly color1: string
    readonly color2: string
    readonly color3: string
}

const Canvas = styled.canvas<CanvasProps>`
    border-radius: 5px;
    width: 100%;
    height: 100%;
    background: rgb(13,36,0);
    background: linear-gradient(137deg, ${({ color1 }) => color1} 0%,  ${({ color2 }) => color2} 65%,  ${({ color3 }) => color3} 100%);
`;

const SliderWrapper = styled.div`
     position: relative;
     width: 100%;
     height: 100%;
`;

const SliderPlaceholderText = styled(Subtitle1)`
    position: absolute;
    top: 0;
    left: 50px;
`;

const BottomContent = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 16px;
`;

const InputContent = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 8px;
`;

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 200;
const COLORS = ['red', 'green', 'aqua', 'blue', 'black', 'cyan', 'darkmagenta', 'orange', 'navy', 'yellow', 'aquamarine', 'brown', 'white'];

function getRandColor(ignore: readonly string[]): string {
    const toPickFrom = [...COLORS].filter(c => !ignore.includes(c));
    return toPickFrom[Math.floor(Math.random() * toPickFrom.length)];
}

type Position = {
    readonly x: number
    readonly y: number
}

type Square = {
    readonly pos: readonly Position[]
    readonly color: string
}

type SliderData = {
    readonly xOffset: number
    readonly yOffset: number
    readonly destX: number
}

type FinishPuzzleProps = {
    readonly offset: string
    readonly challengesCompleted: number
}

export const FinishPuzzleCaptcha = ({ challengesCompleted, offset }: FinishPuzzleProps) => {
    const canvas = createRef<HTMLCanvasElement>();
    const { addTime, onChallengeComplete } = useGame();

    const [sliderData, setSliderData] = useState<readonly SliderData[]>([]);
    const [colors, setColors] = useState<readonly string[]>([]);
    const [squares, setSquares] = useState<readonly Square[]>([]);
    const [wrong, setWrong] = useState(false);

    const getAdjust = (base: number) => {
        return base + ((Math.random() * 10) - 5);
    };

    useEffect(() => {
        setSliderData(Array.from({ length: 1 + Math.floor(challengesCompleted / 10) }, () => {
            return {
                xOffset: 0,
                yOffset: 25 + Math.floor(Math.random() * (CANVAS_HEIGHT - 75)),
                destX: 300 + Math.floor(Math.random() * 150),
            };
        }));
        const c1 = getRandColor([]);
        const c2 = getRandColor([c1]);
        const c3 = getRandColor([c1, c2]);
        const colorsToSet = [c1, c2, c3];
        console.log(colorsToSet);
        setColors(colorsToSet);

        const sWidth = 10;
        const sHeight = 4;
        const squaresToSet = Array(sWidth * sHeight);
        // eslint-disable-next-line functional/no-let
        for (let y = 0; y < sHeight; y++) {
            // eslint-disable-next-line functional/no-let
            for (let x = 0; x < sWidth; x++) {
                squaresToSet[(y * sWidth) + x] = {
                    color: colorsToSet[x % 3],
                    pos: [
                        { x: 15 + (50 * x) + getAdjust(0), y: 15 + (45 * y) + getAdjust(0) },
                        { x: 15 + (50 * x) + getAdjust(30), y: 15 + (45 * y) + getAdjust(0) },
                        { x: 15 + (50 * x) + getAdjust(30), y: 15 + (45 * y) + getAdjust(30) },
                        { x: 15 + (50 * x) + getAdjust(0), y: 15 + (45 * y) + getAdjust(30) }
                    ]
                };
            }
        }
        setSquares(squaresToSet);
    }, []);

    useEffect(() => {
        reloadCanvasContent();
    }, [sliderData]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const completed = !sliderData.some(s => Math.abs(s.xOffset - s.destX) > 5);
        if (completed) {
            addTime(3);
            onChallengeComplete(Challenge.PuzzleCaptcha);
        }
        else {
            setWrong(true);
            addTime(-10);
        }
    };

    const reloadCanvasContent = () => {
        const c = canvas.current;
        const ctx = c?.getContext('2d');
        if (!c || !ctx)
            return;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = 'bolder 30px Arial';
        ctx.textAlign = 'center';

        for (const square in squares) {
            drawRandomsqaure(ctx, squares[square]);
        }

        for (const key in sliderData) {
            const data = sliderData[key];
            drawPuzzlePiece(ctx, data.destX, data.yOffset, '#00000088');
            drawPuzzlePiece(ctx, data.xOffset, data.yOffset);
        }
    };

    const drawPuzzlePiece = (ctx: CanvasRenderingContext2D, xOffset: number, yOffset: number, fill?: string) => {
        ctx.translate(xOffset, yOffset);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(20, -5, 7, .75 * Math.PI, 2.25 * Math.PI);
        ctx.lineTo(40, 0);
        ctx.arc(45, 20, 7, 1.25 * Math.PI, 2.75 * Math.PI);
        ctx.lineTo(40, 40);
        ctx.lineTo(0, 40);
        ctx.arc(6, 20, 7, .8 * Math.PI, 1.2 * Math.PI, true);
        ctx.lineTo(0, 0);
        ctx.closePath();
        if (fill) {
            ctx.strokeStyle = fill;
            ctx.fillStyle = fill;
        }
        else {
            const gradient = ctx.createLinearGradient(-5, -5, 45, 45);
            gradient.addColorStop(0, colors[0] ?? 'black');
            gradient.addColorStop(.6, colors[1] ?? 'black');
            gradient.addColorStop(1, colors[2] ?? 'black');
            ctx.fillStyle = gradient;
            ctx.strokeStyle = '#00000000';
        }
        ctx.fill();
        ctx.stroke();
        ctx.translate(-xOffset, -yOffset);
    };


    const drawRandomsqaure = (ctx: CanvasRenderingContext2D, sqaure: Square) => {
        ctx.beginPath();
        ctx.moveTo(sqaure.pos[0].x, sqaure.pos[0].y);
        ctx.lineTo(sqaure.pos[1].x, sqaure.pos[1].y);
        ctx.lineTo(sqaure.pos[2].x, sqaure.pos[2].y);
        ctx.lineTo(sqaure.pos[3].x, sqaure.pos[3].y);
        ctx.closePath();
        ctx.strokeStyle = sqaure.color;
        ctx.fillStyle = sqaure.color;
        ctx.fill();
        ctx.stroke();
    };

    const setSliderX = (index: number, x: number) => {
        setSliderData(old => {
            const copy = [...old];
            const toSet = [...copy.slice(0, index), {
                ...copy[index],
                xOffset: x
            },
            ...copy.slice(index + 1)];
            return toSet;
        });
    };


    return (
        <ContentWrapper>
            <form onSubmit={onSubmit}>
                <CaptchaBox width={500} height={325 + (sliderData.length * 30)} offset={offset}>
                    <Canvas ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} color1={colors[0]} color2={colors[1]} color3={colors[2]} />
                    <div>
                        {
                            sliderData.map((s, i) => (
                                <SliderWrapper key={i}>
                                    <Slider type='range' value={s.xOffset} min='0' max={CANVAS_WIDTH - 50} onChange={e => setSliderX(i, parseInt(e.target.value))} />
                                    {s.xOffset === 0 && <SliderPlaceholderText>Slide to finish the puzzle</SliderPlaceholderText>}
                                </SliderWrapper>
                            ))
                        }
                    </div>
                    <BottomContent>
                        <InputContent>
                            <ContainedButton className={wrong ? 'wrong' : ''} onAnimationEnd={() => setWrong(false)} type='submit'>Submit</ContainedButton>
                        </InputContent>
                        <UnCaptchaInfo />
                    </BottomContent>
                </CaptchaBox>
            </form>
        </ContentWrapper >
    );
};