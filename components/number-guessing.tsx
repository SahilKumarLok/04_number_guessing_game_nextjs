"use client";

import { useState, useEffect, ChangeEvent } from "react";

// Number Guessing Game Component
export default function NumberGuessingGame() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<number | string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts] = useState<number>(3); // Set a limit for max attempts
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);

  // Function to generate a random number between 1 and 10
  const generateRandomNumber = () => {
    const randomNumber: number = Math.floor(Math.random() * 10) + 1;
    setTargetNumber(randomNumber);
  };

  // Effect to start the game by generating a target number
  useEffect(() => {
    if (gameStarted && !paused) {
      generateRandomNumber();
    }
  }, [gameStarted, paused]);

  // Function to handle the start of the game
  const handleStartGame = (): void => {
    setGameStarted(true);
    setGameOver(false);
    setAttempts(0);
    setPaused(false);
  };

  // Function to handle pausing the game
  const handlePauseGame = (): void => {
    setPaused(true);
  };

  // Function to handle resuming the game
  const handleResumeGame = (): void => {
    setPaused(false);
  };

  // Function to handle user guesses
  const handleGuess = (): void => {
    if (typeof userGuess === "number" && userGuess === targetNumber) {
      setWins(wins + 1);
      setGameOver(true);
    } else {
      setAttempts(attempts + 1);

      if (attempts + 1 >= maxAttempts) {
        setLosses(losses + 1);
        setGameOver(true);
      }
    }
  };

  // Function to reset the game after winning or losing
  const handleTryAgain = (): void => {
    setGameStarted(false);
    setGameOver(false);
    setUserGuess("");
    setAttempts(0);
    generateRandomNumber(); // Generate a new target number for the next game
  };

  // Function to handle input changes for user guesses
  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setUserGuess(value);
    } else {
      setUserGuess("");
    }
  };

  // JSX for rendering the number guessing game
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black text-white">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-black">
        <h1 className="text-3xl font-bold text-center mb-2">Number Guessing Game</h1>
        <p className="text-center mb-4">Guess the number between 1 and 10!</p>

        {/* Start Game Button */}
        {!gameStarted && (
          <div className="flex justify-center mb-4">
            <Button
              onClick={handleStartGame}
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Game
            </Button>
          </div>
        )}

        {/* Game Interface (if the game has started and is not over) */}
        {gameStarted && !gameOver && (
          <div>
            <div className="flex justify-center mb-4">
              {paused ? (
                <Button
                  onClick={handleResumeGame}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={handlePauseGame}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Pause
                </Button>
              )}
            </div>

            {/* User Input for Guess */}
            <div className="flex justify-center mb-4">
              <Input
                type="number"
                value={userGuess}
                onChange={handleUserGuessChange}
                className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs text-black"
                placeholder="Enter your guess"
              />
              <Button
                onClick={handleGuess}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Guess
              </Button>
            </div>

            {/* Attempts Display */}
            <div className="text-center mb-4">
              <p>Attempts: {attempts}/{maxAttempts}</p>
            </div>
          </div>
        )}

        {/* Game Over (Win or Loss) */}
        {gameOver && (
          <div>
            <div className="text-center mb-4">
              {attempts >= maxAttempts ? (
                <h2 className="text-2xl font-bold text-red-500">You Lost!</h2>
              ) : (
                <h2 className="text-2xl font-bold text-green-500">You Won!</h2>
              )}
              <p>
                The correct number was {targetNumber}. You guessed it in {attempts}{" "}
                attempts.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleTryAgain}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Wins and Losses Counter */}
        <div className="flex justify-between mt-4">
          <p className="font-bold text-green-500">Wins: {wins}</p>
          <p className="font-bold text-red-500">Losses: {losses}</p>
        </div>
      </div>
    </div>
  );
}

// Button Component (placeholder for UI framework button)
function Button({ onClick, children, className }: any) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

// Input Component (placeholder for UI framework input)
function Input({ type, value, onChange, className, placeholder }: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
  );
}



