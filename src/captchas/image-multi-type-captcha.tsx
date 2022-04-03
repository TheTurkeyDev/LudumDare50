import { ContainedButton, Headline5, HorizontalRule, Subtitle1 } from '@theturkeydev/gobble-lib-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
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

    &:hover{
        cursor: pointer;
    }
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
    readonly selected: boolean
}
const Image = styled.img<ImageProps>`
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
        id: 'fire_hydrant',
        display: 'Fire Hydrant',
        images: ['fire_hydrant/fh_1.jpg', 'fire_hydrant/fh_2.jpg', 'fire_hydrant/fh_3.jpg', 'fire_hydrant/fh_4.jpg', 'fire_hydrant/fh_5.jpg']
    },
    {
        id: 'bench',
        display: 'Bench',
        images: ['bench/b_1.jpg', 'bench/b_2.jpg', 'bench/b_3.jpg', 'bench/b_4.jpg']
    },
    {
        id: 'traffic_light',
        display: 'Traffic Light',
        images: ['traffic_light/tl_1.jpg', 'traffic_light/tl_2.jpg', 'traffic_light/tl_3.jpg']
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

type ImageMultiTypeCaptchaProps = {
    readonly offset: string
}

export const ImageMultiTypeCaptcha = ({ offset }: ImageMultiTypeCaptchaProps) => {
    const [group, setGroup] = useState<Group>();
    const [displayed, setDisplayed] = useState<readonly Displayed[]>([]);
    const [wrong, setWrong] = useState(false);

    const { addTime, onChallengeComplete } = useGame();

    useEffect(() => {
        reloadImage(false);
    }, []);

    const reloadImage = (removeTime: boolean) => {
        if (removeTime) {
            addTime(-10);
        }

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
    };


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const correct = !displayed.some(d => !(d.selected && group?.id === d.group) && !(!d.selected && group?.id !== d.group));

        if (correct) {
            addTime(3);
            onChallengeComplete(Challenge.ImageMultiSelectCaptcha);
        }
        else {
            setWrong(true);
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
                <CaptchaBox width={300} height={450} offset={offset}>
                    <Title>
                        <StyledSubtitle1>Select all images with a</StyledSubtitle1>
                        <StyledHeadline5>{group?.display}</StyledHeadline5>
                        <StyledSubtitle1>Click verify once there are none left</StyledSubtitle1>
                    </Title>
                    <Images>
                        {
                            displayed.map((d, i) => (
                                <ImageDiv key={i} onClick={() => selectImage(i)} >
                                    <CheckIcon selected={d.selected} className='fa-solid fa-circle-check' />
                                    <Image src={`./res/imgs/${d.image}`} selected={d.selected} />
                                </ImageDiv>
                            ))
                        }
                    </Images>
                    <Controlls>
                        <IconBar>
                            <Icon className='fa-solid fa-arrow-rotate-right' onClick={() => reloadImage(true)} />
                            <Icon className='fa-solid fa-circle-info' />
                        </IconBar>
                        <ContainedButton className={wrong ? 'wrong' : ''} onAnimationEnd={() => setWrong(false)} type='submit'>VERIFY</ContainedButton>
                    </Controlls>
                </CaptchaBox>
            </form>
        </ContentWrapper>
    );
};