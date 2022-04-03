import { ContainedButton, Headline5, HorizontalRule, Subtitle1 } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
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

const Images = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 4px;
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

const ImageDiv = styled.div`
    width: 96px;
    height: 96px;
    position: relative;
    display: grid;
    justify-items: center;
    align-items: center;

    &:hover{
        cursor: pointer;
    }
`;

type CheckIconProps = {
    readonly selected: boolean
}
const CheckIcon = styled.i<CheckIconProps>`
    position: absolute;
    top: 5px;
    left: 5px;
    color: #2888e2;
    font-size: 24px;
    background-color: white;
    border-radius: 15px;
    opacity: ${({ selected }) => selected ? '100%' : '0'};
    transition: 0.5s;
`;

type ImageProps = {
    readonly image: string
    readonly selected: boolean
}
const Image = styled.div<ImageProps>`
    background-color: ${({ image }) => image};
    width: ${({ selected }) => selected ? '76' : '96'}px;
    height: ${({ selected }) => selected ? '76' : '96'}px;
    transition: 0.5s;
`;

const StyledSubtitle1 = styled(Subtitle1)`
    color: white;
`;

const StyledHeadline5 = styled(Headline5)`
    color: white;
`;

type Group = {
    readonly id: string,
    readonly display: string,
    readonly images: readonly string[]
}

const groups: readonly Group[] = [
    {
        id: 'group_1',
        display: 'Red',
        images: ['red', 'red', 'red', 'red', 'red']
    },
    {
        id: 'group_2',
        display: 'Cyan',
        images: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan']
    },
    {
        id: 'group_3',
        display: 'Yellow',
        images: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow']
    },
    {
        id: 'group_4',
        display: 'Black',
        images: ['black', 'black', 'black', 'black', 'black']
    }
];

type Displayed = {
    readonly image: string
    readonly selected: boolean
    readonly group: string
}


function rand(num: number) {
    return Math.floor(Math.random() * num);
}

export const ImageMultiTypeCaptcha = () => {
    const [group, setGroup] = useState<Group>();
    const [displayed, setDisplayed] = useState<readonly Displayed[]>([]);

    const { addTime, onChallengeComplete } = useGame();

    useEffect(() => {
        const chosenGroup = groups[rand(groups.length)];

        setDisplayed(Array.from({ length: 9 }, () => {
            const randGroup = groups[rand(groups.length)];
            const groupImages = randGroup.images;

            return {
                group: randGroup.id,
                image: groupImages[rand(groupImages.length)],
                selected: false
            };
        }));


        setGroup(chosenGroup);
    }, []);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const correct = !displayed.some(d => !(d.selected && group?.id === d.group) && !(!d.selected && group?.id !== d.group));

        if (correct) {
            addTime(5);
            onChallengeComplete(Challenge.ImageMultiSelectCaptcha);
        }
        else {
            addTime(-10);
        }
    };

    const selectImage = (index: number) => {
        setDisplayed(old => {
            const copy = [...old];
            const toSet = [...copy.slice(0, index), {
                ...copy[index],
                selected: !copy[index].selected
            },
            ...copy.slice(index + 1)];
            return toSet;
        });
    };

    return (
        <ContentWrapper>
            <form onSubmit={onSubmit}>
                <CaptchaBox>
                    <Title>
                        <StyledSubtitle1>Select all images with a</StyledSubtitle1>
                        <StyledHeadline5>{group?.display}</StyledHeadline5>
                        <StyledSubtitle1>Click verify once there are none left</StyledSubtitle1>
                    </Title>
                    <Images>
                        {
                            displayed.map((d, i) => (
                                <ImageDiv onClick={() => selectImage(i)} >
                                    <CheckIcon selected={d.selected} className='fa-solid fa-circle-check' />
                                    <Image key={i} image={d.image} selected={d.selected} />
                                </ImageDiv>
                            ))
                        }
                    </Images>
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