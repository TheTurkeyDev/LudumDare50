import { BaseTheme, ContainedButton, Headline5, Subtitle1 } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import styled, { ThemeProps } from 'styled-components';
import { Challenge } from '../challenges-enum';
import { useGame } from '../game-context';
import { ContentBox, ContentWrapper } from '../styles/styles';

const CaptchaBox = styled(ContentBox)`
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 8px;
    align-items: center;
    gap: 8px;
`;

const Title = styled.div`
    padding: 8px;
    background-color: #2888e2;
    color: white;
`;

type ImageProps = {
    readonly url: string
}
const Image = styled.div<ImageProps>`
    background-image: url(${({ url }) => url});
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    width: 100%;
    height: 100%;
`;

const Controlls = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
`;

const IconBar = styled.div`
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto 1fr;
`;

const Icon = styled.i`
    font-size: 24px;
    &:hover{
        cursor: pointer;
    }
`;

type ImageDivProps = {
    readonly selected: boolean
}
const ImageDiv = styled.div<ImageDivProps>`
    position: relative;
    display: grid;
    justify-items: center;
    align-items: center;
    border: ${({ selected }) => selected ? '10px' : '1px'} solid ${({ theme }: ThemeProps<BaseTheme>) => theme.surface.color};
    transition: 0.5s;

    &:hover{
        cursor: pointer;
    }
`;

type CheckIconProps = {
    readonly selected: boolean
}
const CheckIcon = styled.i<CheckIconProps>`
    position: absolute;
    top: -5px;
    left: -5px;
    color: #2888e2;
    font-size: 24px;
    background-color: white;
    border-radius: 15px;
    opacity: ${({ selected }) => selected ? '100%' : '0'};
    transition: 0.5s;
`;

const StyledSubtitle1 = styled(Subtitle1)`
    color: white;
`;

const StyledHeadline5 = styled(Headline5)`
    color: white;
`;

type ImageType = {
    readonly image: string
    readonly answers: readonly number[]
    readonly toSelect: string
}
const images: readonly ImageType[] = [
    {
        image: './res/imgs/multi_select/img_1.jpg',
        answers: [4, 8, 9, 13],
        toSelect: 'traffic lights'
    },
    {
        image: './res/imgs/multi_select/img_2.jpg',
        answers: [8, 9, 10, 11, 12, 13, 14, 15],
        toSelect: 'street signs'
    },
    {
        image: './res/imgs/multi_select/img_3.jpg',
        answers: [1, 2, 5, 6, 9, 10, 13, 14],
        toSelect: 'fire hydrant'
    },
    {
        image: './res/imgs/multi_select/img_4.jpg',
        answers: [1, 2, 5, 6],
        toSelect: 'street sign'
    }
];

type ImageSingleCaptchaProps = {
    readonly challengesCompleted: number
    readonly offset: string
}

export const ImageSingleCaptcha = ({ challengesCompleted, offset }: ImageSingleCaptchaProps) => {
    const { addTime, onChallengeComplete } = useGame();

    const [image, setImage] = useState<ImageType>(images[Math.floor(Math.random() * images.length)]);
    const [selected, setSelected] = useState<readonly boolean[]>(() => Array(16).fill(false));
    const [wrong, setWrong] = useState(false);

    useEffect(() => {
        if (challengesCompleted > 15 && Math.random() > 0.5) {
            setImage({
                toSelect: 'boats',
                image: images[Math.floor(Math.random() * images.length)].image,
                answers: []
            });
        }
    }, []);

    const reloadImage = () => {
        addTime(-10);
        setImage(images[Math.floor(Math.random() * images.length)]);
        setSelected(Array(16).fill(false));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const correct = !selected.some((s, i) => s !== image.answers.includes(i));

        if (correct) {
            addTime(3);
            onChallengeComplete(Challenge.ImageSingleCaptcha);
        }
        else {
            setWrong(true);
            addTime(-10);
        }
    };

    const selectCell = (index: number) => {
        setSelected(old => {
            const copy = [...old];
            const toSet = [...copy.slice(0, index), !copy[index], ...copy.slice(index + 1)];
            return toSet;
        });
    };

    return (
        <ContentWrapper>
            <form onSubmit={onSubmit}>
                <CaptchaBox width={300} height={450} offset={offset}>
                    <Title>
                        <StyledSubtitle1>Select all images with</StyledSubtitle1>
                        <StyledHeadline5>{image.toSelect}</StyledHeadline5>
                        <StyledSubtitle1>Click verify once there are none left</StyledSubtitle1>
                    </Title>
                    <Image url={image.image}>
                        {
                            selected.map((s, i) => (
                                <ImageDiv key={i} selected={s} onClick={() => selectCell(i)}>
                                    <CheckIcon selected={s} className='fa-solid fa-circle-check' />
                                </ImageDiv>
                            ))
                        }
                    </Image>
                    <Controlls>
                        <IconBar>
                            <Icon className='fa-solid fa-arrow-rotate-right' onClick={() => reloadImage()} />
                            <Icon className='fa-solid fa-circle-info' />
                        </IconBar>
                        <ContainedButton className={wrong ? 'wrong' : ''} onAnimationEnd={() => setWrong(false)} type='submit'>VERIFY</ContainedButton>
                    </Controlls>
                </CaptchaBox>
            </form>
        </ContentWrapper>
    );
};