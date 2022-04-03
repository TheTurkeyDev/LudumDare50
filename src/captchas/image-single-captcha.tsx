import { BaseTheme, ContainedButton, Headline5, Subtitle1 } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import styled, { ThemeProps } from 'styled-components';
import { Challenge } from '../challenges-enum';
import { useGame } from '../game-context';
import { ContentBox, ContentWrapper } from '../styles/styles';

const CaptchaBox = styled(ContentBox)`
    width: 300px;
    height: 450px;
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
}
const images: readonly ImageType[] = [
    {
        image: '/res/imgs/google_map.png',
        answers: [4, 5, 6, 11]
    }
];

export const ImageSingleCaptcha = () => {
    const { addTime, onChallengeComplete } = useGame();

    const [image, setImage] = useState<ImageType>(() => images[Math.floor(Math.random() * images.length)]);
    const [selected, setSelected] = useState<readonly boolean[]>(() => Array(16).fill(false));

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const correct = !selected.some((s, i) => s !== image.answers.includes(i));

        if (correct) {
            addTime(5);
            onChallengeComplete(Challenge.ImageSingleCaptcha);
        }
        else {
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
                <CaptchaBox>
                    <Title>
                        <StyledSubtitle1>Select all images with a</StyledSubtitle1>
                        <StyledHeadline5>{ }</StyledHeadline5>
                        <StyledSubtitle1>Click verify once there are none left</StyledSubtitle1>
                    </Title>
                    <Image url={'/res/imgs/google_map.png'}>
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
                            <Icon className='fa-solid fa-arrow-rotate-right' />
                            <Icon className='fa-solid fa-circle-info' />
                        </IconBar>
                        <ContainedButton type='submit'>VERIFY</ContainedButton>
                    </Controlls>
                </CaptchaBox>
            </form>
        </ContentWrapper>
    );
};