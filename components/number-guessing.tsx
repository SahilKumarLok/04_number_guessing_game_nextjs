"use client";
import { useState, useEffect, ChangeEvent } from "react";

// Number Guessing Game Component
export default function NumberGuessingGame() {
  // Game state
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<number | string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(5);
  const [hint, setHint] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [range, setRange] = useState<number>(10);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  // Function to generate a random number based on the difficulty range
  const generateRandomNumber = () => {
    const randomNumber: number = Math.floor(Math.random() * range) + 1;
    setTargetNumber(randomNumber);
  };

  // Effect to start the game by generating a target number
  useEffect(() => {
    if (gameStarted && !paused) {
      generateRandomNumber();
    }
  }, [gameStarted, paused]);

  // Handle difficulty change and adjust game parameters accordingly
  const handleDifficultyChange = (level: string) => {
    setDifficulty(level);
    switch (level) {
      case "Medium":
        setRange(20);
        setMaxAttempts(4);
        break;
      case "Hard":
        setRange(50);
        setMaxAttempts(3);
        break;
      default:
        setRange(10);
        setMaxAttempts(5);
    }
  };

  // Function to handle the start of the game
  const handleStartGame = (): void => {
    setGameStarted(true);
    setGameOver(false);
    setAttempts(0);
    setHint("");
    setPaused(false);
    generateRandomNumber(); // Ensure a new number is generated on game start
  };

  // Function to handle user guesses
  const handleGuess = (): void => {
    if (typeof userGuess === "number") {
      setAttempts(attempts + 1);

      if (userGuess === targetNumber) {
        setWins(wins + 1);
        setGameOver(true);

        if (bestScore === null || attempts + 1 < bestScore) {
          setBestScore(attempts + 1);
        }
      } else {
        // Provide hints if the guess is wrong
        if (userGuess < targetNumber) {
          setHint("Too Low!");
        } else {
          setHint("Too High!");
        }

        // Check for game over (loss)
        if (attempts + 1 >= maxAttempts) {
          setLosses(losses + 1);
          setGameOver(true);
        }
      }
    }
  };

  // Function to reset the game after winning or losing
  const handleTryAgain = (): void => {
    setGameStarted(false);
    setGameOver(false);
    setUserGuess("");
    setAttempts(0);
    setHint("");
    generateRandomNumber(); // Generate a new target number for the next game
  };

  // Function to handle input changes for user guesses
  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    const numericValue: number = parseInt(value);
    if (!isNaN(numericValue)) {
      setUserGuess(numericValue);
    } else {
      setUserGuess("");
    }
  };

  // JSX for rendering the number guessing game
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black text-white">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-black">
        <h1 className="text-3xl font-bold text-center mb-2">Number Guessing Game</h1>
        <p className="text-center mb-4">Guess the number between 1 and {range}!</p>

        {/* Difficulty selection */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={() => handleDifficultyChange("Easy")}
            className={`mr-2 ${difficulty === "Easy" ? "bg-green-500" : "bg-gray-500"} text-white py-2 px-4 rounded`}
          >
            Easy
          </Button>
          <Button
            onClick={() => handleDifficultyChange("Medium")}
            className={`mr-2 ${difficulty === "Medium" ? "bg-yellow-500" : "bg-gray-500"} text-white py-2 px-4 rounded`}
          >
            Medium
          </Button>
          <Button
            onClick={() => handleDifficultyChange("Hard")}
            className={`${difficulty === "Hard" ? "bg-red-500" : "bg-gray-500"} text-white py-2 px-4 rounded`}
          >
            Hard
          </Button>
        </div>

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

            {/* Display the hint and attempts */}
            <div className="text-center mb-4">
              <p>{hint}</p>
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
              </p >
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

        {/* Wins, Losses, and Best Score */}
        <div className="flex justify-between mt-4">
          <p className="font-bold text-green-500">Wins: {wins}</p>
          <p className="font-bold text-red-500">Losses: {losses}</p>
        </div>
        {bestScore !== null && (
          <div className="text-center mt-2">
            <p className="text-yellow-500">Best Score (Fewest Attempts): {bestScore}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Button Component
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className: string;
}

function Button({ onClick, children, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

// Input Component
interface InputProps {
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  placeholder: string;
}

function Input({ type, value, onChange, className, placeholder }: InputProps) {
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


