import { createContext, useContext } from 'react';


type GameContextType = {
    readonly start: () => void
    readonly onChallengeComplete: (current: number) => void
    readonly addTime: (amount: number) => void
}

export const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
    const game = useContext(GameContext);

    if (!game)
        throw new Error('Game is undefined!');
    return game;
};