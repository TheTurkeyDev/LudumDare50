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

const StyledCenterContent = styled(CenterContent)`
    justify-content: center;
    gap: 32px;
`;

type HeaderBarProps = {
    readonly challengesCompleted: number
    readonly highScore: string
}
export const HeaderBar = ({ challengesCompleted, highScore }: HeaderBarProps) => {
    const { theme, setTheme } = useThemeContext();
    const isDarkTheme = theme === 'dark';

    return (
        <NavBar>
            <Headline6>Ludum Dare 50</Headline6>
            <StyledCenterContent>
                <Headline5>Challenges Completed: {challengesCompleted}</Headline5>
                <Headline5>High Score: {highScore}</Headline5>
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