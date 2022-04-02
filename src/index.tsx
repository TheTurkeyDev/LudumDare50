import { BaseTheme, ThemeContextProvider } from '@theturkeydev/gobble-lib-react';
import { render } from 'react-dom';
import { createGlobalStyle, ThemeProps } from 'styled-components';
import { Game } from './game';

const GlobalStyles = createGlobalStyle`
    html, body, #app {
        height: 100vh;
    }

    #app {
        overflow: hidden;
    }

    body {
        margin: 0;
        background-color: ${({ theme }: ThemeProps<BaseTheme>) => theme.background.color};
        color: ${({ theme }: ThemeProps<BaseTheme>) => theme.background.on};
        transition: background-color 0.2s, color 0.2s;
    }
`;

const MainWrapper = (
    <ThemeContextProvider>
        <GlobalStyles />
        <Game />
    </ThemeContextProvider>
);
render(MainWrapper, document.getElementById('app'));