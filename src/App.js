import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import photosMap from './photo-map';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPhotoId: '',
            currentCorrectAnswer: '',
            points: 0
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
            currentPhotoId: photo,
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
        } else {
            console.log("Incorrect!")
        }
    }

    render() {
        return (
            <div>
                <Container photo={this.state.currentPhotoId} />
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
        return <div className="Container">
            {this.props.photo}
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
