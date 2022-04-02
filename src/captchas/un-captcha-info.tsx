import { Body2, Overline } from '@theturkeydev/gobble-lib-react';
import styled from 'styled-components';

const LogoStuff = styled.div`
    display: grid;
    grid-template-rows: 1fr auto auto;
    justify-items: center;
`;

const RecycleIcon = styled.i`
    font-size: 55px;
`;

export const UnCaptchaInfo = () => (
    <LogoStuff>
        <RecycleIcon className='fa-solid fa-recycle' />
        <Body2>unCAPTCHA</Body2>
        <Overline>Privacy - Terms</Overline>
    </LogoStuff>
);