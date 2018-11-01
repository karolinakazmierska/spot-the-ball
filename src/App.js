import React, { Component } from 'react';
import logo from './logo.svg';
import A1 from './photos/A1.png';
import B1 from './photos/B1.png';
import './App.css';
import photosMap from './photo-map';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPhoto: '',
            currentPhotoBallRevealed: '',
            currentCorrectAnswer: '',
            points: 0,
            didAnswerCorrectly: '',
            timer: 0
        };
    }

    componentWillMount() {
        this.changePhoto();
    }

    componentDidMount() {
        this.startRound();
    }

    startRound() {
        // set timeout: after it, call "finishRound function"
        this.setState({
            timer: 5
        });
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick = () => {
        var timer = this.state.timer;
        console.log(timer); // @todo: remove
        if (timer === 0) {
            // time out! show component and stuff
            clearInterval(this.timerID);
            return;
        }
        this.setState({
            timer: timer - 1
        });
    }

    changePhoto() {
        var availablePhotos = ['A1', 'B1']; // @todo: fill with photos
        var rand = Math.floor(Math.random() * availablePhotos.length);
        var photo = availablePhotos[rand];
        console.log(photo);
        var answer = photosMap[photo].correct;
        var revealed = photosMap[photo].revealed;

        this.setState({
            currentPhoto: photo,
            currentCorrectAnswer: answer,
            currentPhotoBallRevealed: revealed
        });
    }

    checkAnswer = (e) => {
        var answer = e.target.textContent;
        if (answer == this.state.currentCorrectAnswer) {
            console.log("Correct answer");
            var points = this.state.points;
            this.setState({
                points: points + 1
            })
            this.showAnswer(true);
        } else {
            console.log("Incorrect!")
            this.showAnswer(false);
        }
        setTimeout(e => {
            this.changePhoto();
            this.setState({
                didAnswerCorrectly: ''
            })
        }, 5000);
    }

    showAnswer(correct) {
        if (correct) {
            this.setState({
                didAnswerCorrectly: true
            })
        } else {
            this.setState({
                didAnswerCorrectly: false
            })
        }
    }

    restartGame() {
        // save username and points to local host
        // clear points from state
        // refresh the view / restart the game...?
    }

    render() {
        return (
            <div>
                <Container photo={this.state.currentPhoto} answer={this.state.didAnswerCorrectly} photoRevealed={this.state.currentPhotoBallRevealed}/>
                <Controls onClick={this.checkAnswer} />
                <Timer time={this.state.timer} />
                <GameOver time={this.state.timer} onClick={this.restartGame}/>
            </div>
        );
    }
}

export default App;

/* Container rendering the photos */
class Container extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var backgroundPhoto = "./photos/" + this.props.photo + ".png";
        var backgroundPhotoBallRevealed = "./photos/" + this.props.photoRevealed + ".png";
        return <div className="Container" style={{backgroundImage: "url(" + require(`${backgroundPhoto}`) + ")"}}>
            { this.props.answer === true &&
                <div className='MessageBox' style={{backgroundImage: "url(" + require(`${backgroundPhotoBallRevealed}`) + ")"}}>{'Correct'}</div>
            }
            { this.props.answer === false &&
                <div className='MessageBox' style={{backgroundImage: "url(" + require(`${backgroundPhotoBallRevealed}`) + ")"}}>{'Incorrect'}</div>
            }
        </div>
    }
}

/* Button controls for choosing the right answer */
function Controls(props) {
    return (
        <div className="ControlsContainer">
            <div className="ControlsButton" onClick={props.onClick}>1</div>
            <div className="ControlsButton" onClick={props.onClick}>2</div>
            <div className="ControlsButton" onClick={props.onClick}>3</div>
            <div className="ControlsButton" onClick={props.onClick}>4</div>
        </div>
    )
}

function Timer(props) {
    return (
        <div className="Timer">{props.time}</div>
    )
}

function GameOver(props) {
    if (props.time === 0) {
        return (
                <div className="GameOver">
                    <div>Game Over</div>
                    <div>Provide your username if you want to save your score:</div>
                    <input></input>
                    <button onClick={props.onClick}>Save & Continue playing</button>
                </div>
        )
    } else {
        return null;
    }
}
