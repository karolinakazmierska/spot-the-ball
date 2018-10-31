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
            didAnswerCorrectly: ''
        };
    }

    componentDidMount() {
        this.changePhoto()
    }

    changePhoto() {
        var availablePhotos = ['A1', 'B1'];

        var rand = Math.floor(Math.random() * availablePhotos.length);
        var photo = availablePhotos[rand];
        console.log(photo);
        var answer = photosMap[photo].correct;

        this.setState({
            currentPhoto: photo,
            currentCorrectAnswer: answer
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
            // show the correct photo with congratulations message + some layover / disable buttons
        } else {
            console.log("Incorrect!")
            this.showAnswer(false);
            // show the correct photo with you had it wrong message + some layover / disable buttons
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

    render() {
        return (
            <div>
                <Container photo={this.state.currentPhoto} answer={this.state.didAnswerCorrectly} photoRevealed={this.state.currentPhotoBallRevealed}/>
                <Controls onClick={this.checkAnswer} />
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
        var backgroundPhoto = `url(./photos/${this.props.photo}.png)`;
        var backgroundPhotoBallRevealed = `url(./photos/${this.props.photoRevealed}.png)`;
        return <div className="Container" style={{backgroundImage: backgroundPhoto}}>
            {this.props.photo}
            { this.props.answer === true &&
                <div className='MessageBox' style={{backgroundImage: backgroundPhotoBallRevealed}}>{'Correct'}</div>
            }
            { this.props.answer === false &&
                <div className='MessageBox' style={{backgroundImage: backgroundPhotoBallRevealed}}>{'Incorrect'}</div>
            }
        </div>
    }
}

/* Button controls for choosing the right answer */
function Controls(props) {
    function handleClick(e) {
        console.log(e.target.textContent);

    }

    return (
        <div className="ControlsContainer">
            <div className="ControlsButton" onClick={props.onClick}>1</div>
            <div className="ControlsButton" onClick={props.onClick}>2</div>
            <div className="ControlsButton" onClick={props.onClick}>3</div>
            <div className="ControlsButton" onClick={props.onClick}>4</div>
        </div>
    )
}
