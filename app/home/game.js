import React, { useState, useEffect } from "react";
import { View, Text, TouchableHighlight } from "react-native";

const Game = () => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (score >= 10) {
            setGameOver(true);
        }
    }, [score]);

    const handlePress = () => {
        setScore(score + 1);
    };

    return (
        <View>
            <Text>Score: {score}</Text>
            <TouchableHighlight onPress={handlePress}>
                <Text>Press me!</Text>
            </TouchableHighlight>
            {gameOver && <Text>Game Over!</Text>}
        </View>
    );
};

export default Game;
