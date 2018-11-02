import React, { Component } from 'react';
import logo from './logo.svg';
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
            timer: 0,
            disableTime: 4000
        };
    }

    componentWillMount() {
        this.changePhoto();
    }

    componentDidMount() {
        this.startRound();
    }

    startRound() {
        this.setState({
            timer: 3
        });
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick = () => {
        var timer = this.state.timer;
        console.log(timer);
        if (timer === 0) {
            clearInterval(this.timerID);
            return;
        }
        this.setState({
            timer: timer - 1
        });
    }

    changePhoto() {
        var availablePhotos = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'R1', 'S1', 'T1'];
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
        var button = e.target;
        button.disabled = true;
        setTimeout(e => {
            button.disabled = false;
        }, this.state.disableTime);
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
        }, this.state.disableTime);
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

    // Save username & score to localHost and restart the game
    restartGame = (inputValue) => {
        var username = inputValue.toString();
        var points = parseInt(this.state.points);
        if (localStorage.getItem('spot-the-ball-' + inputValue)) {
            if (points > parseInt(localStorage.getItem(inputValue))) {
                localStorage.setItem('spot-the-ball-' + inputValue, points);
            }
        } else {
            localStorage.setItem('spot-the-ball-' + inputValue, points);
        }
        this.setState({
            points: 0,
        })
        this.startRound();
    }

    render() {
        return (
            <div>
                <Container photo={this.state.currentPhoto} answer={this.state.didAnswerCorrectly} photoRevealed={this.state.currentPhotoBallRevealed}/>
                <Controls onClick={this.checkAnswer} />
                <Timer time={this.state.timer} />
                <PointsCounter points={this.state.points} />
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
        var backgroundPhoto = "./photos/" + this.props.photo + ".jpg";
        var backgroundPhotoBallRevealed = "./photos/" + this.props.photoRevealed + ".jpg";
        return <div className="Container" style={{backgroundImage: "url(" + require(`${backgroundPhoto}`) + ")"}}>
            { this.props.answer === true &&
                <div className='MessageBox AnswerCorrect' style={{backgroundImage: "url(" + require(`${backgroundPhotoBallRevealed}`) + ")"}}></div>
            }
            { this.props.answer === false &&
                <div className='MessageBox AnswerIncorrect' style={{backgroundImage: "url(" + require(`${backgroundPhotoBallRevealed}`) + ")"}}></div>
            }
        </div>
    }
}

/* Button controls for choosing the right answer */
function Controls(props) {
    return (
        <div className="ControlsContainer">
            <button className="ControlsButton" onClick={props.onClick}>1</button>
            <button className="ControlsButton" onClick={props.onClick}>2</button>
            <button className="ControlsButton" onClick={props.onClick}>3</button>
            <button className="ControlsButton" onClick={props.onClick}>4</button>
        </div>
    )
}

function Timer(props) {
    return (
        <div className="Timer Counter">{props.time}</div>
    )
}

function PointsCounter(props) {
    return (
        <div className="PointsCounter Counter">{props.points}</div>
    )
}

class GameOver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        }
    }

    handleClick = () => {
        this.props.onClick(this.state.inputValue);
    }

    updateInputValue = (e) => {
        this.setState({
            inputValue: e.target.value
        });
    }

    render() {
        return (this.props.time === 0 &&
            <div className="GameOver">
                <div>GAME OVER</div>
                <div>Provide your username if you want to save your score:</div>
                <input value={this.state.inputValue} onChange={this.updateInputValue} />
                <button onClick={this.handleClick}>Save & continue playing</button>
                <Scoreboard />
            </div>
        )
    }
}

class Scoreboard extends Component {
    constructor() {
        super();
    }

    displayUsernames = () => {
        const keys = Object.keys(localStorage);
        var users = keys.filter(key => key.includes('spot-the-ball-'));
        // sort the users array
        const filtered = Object.keys(localStorage)
            .filter(key => key.includes('spot-the-ball-'))
            .reduce((obj, key) => {
                obj[key] = localStorage[key];
                return obj;
            }, {});
        console.log(filtered)

        var usernameByScore = [];
        for (var username in filtered) {
            usernameByScore.push([username, filtered[username]]);
        }
        usernameByScore.sort(function(a, b) {
            return b[1] - a[1];
        });
        console.log(usernameByScore);

        return (
            <ul>
                {usernameByScore.map((user, index) => <li>
                    <span>{index+1 + '. ' + user[0].slice(14,user[0].length) + ': '}</span>
                    <span>{user[1]}</span>
                </li>)}
            </ul>
        )

    }

    render() {
        return (
            <div className="Scoreboard">
                <h1>Leadership board</h1>
                {this.displayUsernames()}
            </div>
        )
    }
}
