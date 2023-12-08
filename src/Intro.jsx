export default function Intro(props) {
    return (
        <div className="intro">
            <h1 className="intro--title">Tenzies</h1>
            <p className="intro--desc">How fast are you?</p>
            <button onClick={props.startGame}>Start Game</button>
        </div>
    )
}