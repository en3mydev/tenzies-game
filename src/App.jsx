import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Intro from "./Intro"

export default function App() {

    const [time, setTime] = React.useState(0)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [count, setCount] = React.useState(0)
    const [introState, setIntroState] = React.useState(true);
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])


    const [bestCount, setBestCount] = React.useState(
        () => JSON.parse(localStorage.getItem("bestCount")) || 0
    )

    React.useEffect(() => {
        localStorage.setItem("bestCount", JSON.stringify(bestCount))
    }, [bestCount])

    React.useEffect(() => {
        if (tenzies && (bestCount === 0 || bestCount > count)) {
            setBestCount(count);
        }
    }, [tenzies, count, bestCount]);


    const [bestTime, setBestTime] = React.useState(
        () => JSON.parse(localStorage.getItem("bestTime")) || 0
    )

    React.useEffect(() => {
        localStorage.setItem("bestTime", JSON.stringify(bestTime))
    }, [bestTime])

    React.useEffect(() => {
        if (tenzies && (bestTime === 0 || bestTime > time)) {
            setBestTime(time)
        }
    }, [tenzies, time, bestTime])

    React.useEffect(() => {
        let intervalId;
        if(isPlaying) {
            intervalId = setInterval(() => setTime(time + 1), 10)
        }
        return () => clearInterval(intervalId)
    }, [isPlaying, time])

    const minutes = Math.floor((time % 360000) / 6000)
    const seconds = Math.floor((time % 6000) / 100)
    const milliseconds = time % 100

    const minutes2 = Math.floor(bestTime / 6000);
    const seconds2 = Math.floor((bestTime % 6000) / 100);
    const milliseconds2 = bestTime % 100;

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setCount(prev => prev+1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
            setTime(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    React.useEffect(() => {
        setIsPlaying(prev => !prev)
    }, [tenzies])


    function startGame() {
        setIntroState(false);
        setIsPlaying(true);
    }


    return (
        <section className="sect">
            <main>
                {introState ? (
                    <div className="daintro">
                        <Intro startGame={startGame} />{" "}
                    </div>
                ) : (
                <>
                {tenzies && <Confetti />}
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                    <button 
                        className="roll-dice" 
                        onClick={rollDice}
                    >
                        {tenzies ? "New Game" : "Roll"}
                    </button>
                </>
                )}
            </main>
            {!introState && <div className="records">
                <p className="records--count">Rolls: {count}</p>
                <p className="records--timer">Time: {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}:
                {milliseconds.toString().padStart(2, "0")}
                </p>
                <p className="records--count-best">Best roll count: {bestCount}</p>
                <p className="records--timer-best">Best time: {minutes2.toString().padStart(2, "0")}:
                {seconds2.toString().padStart(2, "0")}:
                {milliseconds2.toString().padStart(2, "0")}</p>
            </div>}
        </section>
    )
}