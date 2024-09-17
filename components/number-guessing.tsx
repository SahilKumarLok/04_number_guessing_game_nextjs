"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';

const NumberGuessingGame = () => {
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(false);
    const [targetNumber, setTargetNumber] = useState<number>(0);
    const [userGuess, setUserGuess] = useState<number | string>("");
    const [attempts, setAttempts] = useState<number>(0);
    const [maxAttempts, setMaxAttempts] = useState<number>(5);
    const [remainingAttempts, setRemainingAttempts] = useState<number>(5);
    const [hint, setHint] = useState<string>("");
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [range, setRange] = useState<number>(10);

    // Effect to generate target number when game starts and not paused
    useEffect(() => {
        if (gameStarted && !paused) {
            const randomNumber: number = Math.floor(Math.random() * range) + 1;
            setTargetNumber(randomNumber);
        }
    }, [gameStarted, paused, range]);

    // Start the game with the selected difficulty (range)
    const handleStartGame = (newRange: number): void => {
        setRange(newRange);
        setGameStarted(true);
        setGameOver(false);
        setAttempts(0);
        setPaused(false);
        setHint("");
        setMaxAttempts(newRange === 10 ? 5 : newRange === 50 ? 7 : 10);
        setRemainingAttempts(newRange === 10 ? 5 : newRange === 50 ? 7 : 10);
        setTargetNumber(Math.floor(Math.random() * newRange) + 1); // Generate new target number
    };

    // Pause and resume the game
    const handlePauseGame = (): void => setPaused(true);
    const handleResumeGame = (): void => setPaused(false);

    // Handle user guess
    const handleGuess = (): void => {
        if (typeof userGuess === "number" && userGuess >= 1 && userGuess <= range) {
            if (userGuess === targetNumber) {
                setGameOver(true);
                if (bestScore === null || attempts < bestScore) setBestScore(attempts + 1);
            } else {
                setHint(userGuess > targetNumber ? "Too high!" : "Too low!");
                setAttempts((prevAttempts) => prevAttempts + 1);
                setRemainingAttempts((prev) => prev - 1);
                if (remainingAttempts - 1 <= 0) {
                    setGameOver(true);
                }
            }
        }
    };

    // Restart game
    const handleTryAgain = (): void => {
        setGameStarted(false);
        setGameOver(false);
        setUserGuess("");
        setAttempts(0);
        setHint("");
        setRemainingAttempts(maxAttempts);
        setTargetNumber(Math.floor(Math.random() * range) + 1); // New target number
    };

    // Handle changes in user input with limit to 2 digits
    const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = e.target.value;

        // Limit input to two digits
        if (value.length > 2) {
            value = value.slice(0, 2); // Keep only first two digits
        }

        // Parse to number or set to empty string
        const numberValue = parseInt(value, 10);
        setUserGuess(isNaN(numberValue) ? "" : numberValue); 
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2 text-black">Number Guessing Game</h1>
                <p className="text-center text-black mb-4">Try to guess the number!</p>

                {/* Game not started */}
                {!gameStarted && (
                    <div className="flex flex-col items-center mb-4">
                        <p>Select Difficulty:</p>
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => handleStartGame(10)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Easy (1-10)</button>
                            <button onClick={() => handleStartGame(50)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">Medium (1-50)</button>
                            <button onClick={() => handleStartGame(100)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Hard (1-100)</button>
                        </div>
                    </div>
                )}

                {/* Game started but not over */}
                {gameStarted && !gameOver && (
                    <div>
                        {/* Pause and Resume buttons */}
                        <div className="flex justify-center mb-4">
                            {paused ? (
                                <button
                                    onClick={handleResumeGame}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Resume
                                </button>
                            ) : (
                                <button
                                    onClick={handlePauseGame}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Pause
                                </button>
                            )}
                        </div>

                        {/* Guess input */}
                        <div className="flex justify-center mb-4">
                            <input
                                type="number"
                                value={userGuess}
                                onChange={handleUserGuessChange}
                                className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs text-black" // Added 'text-black' to make typing color black
                                placeholder={`Enter your guess (1-${range})`}
                                maxLength={2} // Added maxLength for input
                            />
                            <button
                                onClick={handleGuess}
                                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-4"
                            >
                                Guess
                            </button>
                        </div>

                        {/* Display attempts and hint */}
                        <div className="text-center text-black mb-4">
                            <p>Attempts: {attempts}</p>
                            <p>Remaining Attempts: {remainingAttempts}</p>
                            <p>{hint}</p>
                        </div>
                    </div>
                )}

                {/* Game over screen */}
                {gameOver && (
                    <div>
                        <div className="text-center mb-4 text-black">
                            <h2 className="text-2xl font-bold">Game Over!</h2>
                            {remainingAttempts > 0 ? (
                                <p>You guessed the number in {attempts} attempts!</p>
                            ) : (
                                <p>You've run out of attempts. The number was {targetNumber}.</p>
                            )}
                            {bestScore !== null && <p>Best Score: {bestScore} attempts</p>}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleTryAgain}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NumberGuessingGame;


