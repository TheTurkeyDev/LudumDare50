import { BaseTheme, CenterContent, Headline5, Headline6, NavBar, NavText, ToggleSwitch, useThemeContext } from '@theturkeydev/gobble-lib-react';
import styled, { ThemedStyledProps, ThemeProps } from 'styled-components';

const EndContent = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
    align-items: center;
`;

const NoLabel = styled.div`
    display: grid;
    grid-template-columns: auto auto;
`;

const getTimeColor = (isDarkTheme: boolean, time: number) => {
    if (isDarkTheme) {
        return time > 100 ? '#03c703' : '#ff5b5b';
    }
    else {
        return time > 100 ? '#008300' : '#b70000';
    }
};

type TimeProps = {
    readonly time: number
}

const Time = styled(Headline5)`
    color: ${({ theme, time }: ThemedStyledProps<TimeProps, BaseTheme>) => getTimeColor(theme.isDarkTheme, time)};
`;

const StyledCenterContent = styled(CenterContent)`
    justify-content: center;
    gap: 32px;
`;

const formatTime = (time: number) => {
    if (time < 0)
        return '0.0';
    const tenths = time % 10;
    const seconds = Math.floor((time % 600) / 10);
    const minutes = Math.floor(time / 600);
    return `${minutes === 0 ? '' : `${minutes}:`}${seconds < 10 && minutes > 0 ? `0${seconds}` : seconds}.${tenths}`;
};

type HeaderBarProps = {
    readonly time: number
    readonly challengesCompleted: number
}
export const HeaderBar = ({ time, challengesCompleted }: HeaderBarProps) => {
    const { theme, setTheme } = useThemeContext();
    const isDarkTheme = theme === 'dark';

    return (
        <NavBar>
            <Headline6>Ludum Dare 50</Headline6>
            <StyledCenterContent>
                <Time time={time}>{formatTime(time)}</Time>
                <Headline5>Challenges Completed: {challengesCompleted}</Headline5>
                <Headline5>Challenges Completed: {challengesCompleted}</Headline5>
            </StyledCenterContent>
            <EndContent>
                <NavText>
                    <i className={`fas fa-${isDarkTheme ? 'moon' : 'sun'}`} />
                </NavText>
                <NoLabel>
                    <ToggleSwitch label='' checked={isDarkTheme} onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')} />
                </NoLabel>
            </EndContent>
        </NavBar>
    );
};