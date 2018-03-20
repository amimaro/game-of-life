import React, {
    Component
} from 'react';
import './App.css';
import {Button, ButtonToolbar, Pager} from 'react-bootstrap';

class Board extends Component {
    constructor(props){
        super(props);
        this.state = {
            clearBoard: [],
            board: [],
            dots: [[]],
            m: 50,
            n: 100,
            chance: 0.25,
        }

        this.zeros = this.zeros.bind(this);
        this.setupBoard = this.setupBoard.bind(this);
        this.checkBoard = this.checkBoard.bind(this);
        this.clearBoard = this.clearBoard.bind(this);
    }
    clearBoard(){
        this.board = [];
        this.dots = this.zeros([this.state.m, this.state.n]);
        for(let i = 0; i < this.state.m; i++){
            for(let j = 0; j < this.state.n; j++){
                this.board.push(<div key={`${i}-${j}`} className={"board-element"}></div>);
            }
        }
        this.setState({board: this.board, dots: this.dots});
    }
    zeros(dimensions){
        var array = [];
        for (let i = 0; i < dimensions[0]; i++) {
            array.push(dimensions.length === 1 ? 0 : this.zeros(dimensions.slice(1)));
        }
        return array;
    }
    setupBoard(){
        this.board = [];
        this.dots = this.zeros([this.state.m, this.state.n]);
        for(let i = 0; i < this.state.m; i++){
            for(let j = 0; j < this.state.n; j++){
                if(Math.random() > this.state.chance) {
                    this.dots[i][j] = 0;
                } else {
                    this.dots[i][j] = 1;
                }
                this.board.push(<div key={`${i}-${j}`} className={"board-element"}></div>);
            }
        }
        this.setState({board: this.board, dots: this.dots});
    }
    checkBoard() {
        this.board = [];
        this.dots = this.state.dots;
        for(let i = 0; i < this.state.m; i++){
            for(let j = 0; j < this.state.n; j++){
                let c = 0;
                try{
                    //Count Neighbors
                    if(this.dots[i-1][j-1] >= 1){
                        c++;
                    }
                    if(this.dots[i-1][j] >= 1) {
                        c++;
                    }
                    if(this.dots[i-1][j+1] >= 1) {
                        c++;
                    }
                    if(this.dots[i][j-1] >= 1) {
                        c++;
                    }
                    if(this.dots[i][j+1] >= 1) {
                        c++;
                    }
                    if(this.dots[i+1][j-1] >= 1) {
                        c++;
                    }
                    if(this.dots[i+1][j] >= 1) {
                        c++;
                    }
                    if(this.dots[i+1][j+1] >= 1) {
                        c++;
                    }
                } catch(err){
                }

                if((c < 2 || c > 3) && this.dots[i][j] >= 1){ //Dead - underpopulation / overpopulation
                    this.dots[i][j] = 2;
                } else if((c === 2 || c === 3) && this.dots[i][j] >= 1) { //Stays Alive
                    this.dots[i][j] = 1;
                } else if(c === 3 && this.dots[i][j] === 0) {
                    this.dots[i][j] = -1;
                }
            }
        }

        for(let i = 0; i < this.state.m; i++){
            for(let j = 0; j < this.state.n; j++){
                if(this.dots[i][j] === 0 || this.dots[i][j] === 2){
                    this.dots[i][j] = 0;
                    this.board.push(<div key={`${i}-${j}`} className={"board-element"}></div>);
                } else {
                    this.board.push(<div key={`${i}-${j}`} className={"board-element board-element-marked"}></div>);
                }
                if(this.dots[i][j] === -1)
                    this.dots[i][j] = 1;
            }
        }
        this.setState({board: this.board, dots: this.dots});
    }
    componentDidMount() {
        this.setupBoard();
    }
    render() {
        return (
            <div className="board center-div">
                {this.state.board}
            </div>
        );
    }
}
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            generation: 0,
            speed: 1000,
        }
        this.setControl = this.setControl.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.configThread = this.configThread.bind(this);
    }
    setControl(option){
        if(option === 'start') {
            if(this.state.generation === 0)
                this.refs.board.setupBoard();
            this.configThread();
        } else if(option === 'pause') {
            clearInterval(this.myTimer);
        } else if(option === 'clear'){
            clearInterval(this.myTimer);
            this.refs.board.clearBoard();
            this.setState({generation: 0});
        }
    }
    setSpeed(speed){
        if(speed === 'fast') {
            this.setState({speed: 250}, ()=>{this.configThread();});
        } else if(speed === 'medium') {
            this.setState({speed: 1000}, ()=>{this.configThread();});
        } else if(speed === 'slow') {
            this.setState({speed: 2000}, ()=>{this.configThread();});
        }
    }
    configThread(){
        clearInterval(this.myTimer);
        this.myTimer = setInterval(()=>{
            // console.log(this.state.speed);
            this.refs.board.checkBoard();
            this.setState({generation: this.state.generation+1});
        }, this.state.speed);
    }
    render() {
        return (
            <div className="App container" >
                <h1>freeCodeCamp - Game of Life</h1>
                <p>by <a target="_blank" rel="noopener noreferrer" href="https://github.com/amimaro">Amimaro</a></p>
                <hr/>
                <Pager>
                    <h4>Generation: {this.state.generation}</h4>
                    <Pager.Item href="#" onClick={()=>{this.setControl('start')}}>Start</Pager.Item>
                    {' '}
                    <Pager.Item href="#" onClick={()=>{this.setControl('pause')}}>Pause</Pager.Item>
                    {' '}
                    <Pager.Item href="#" onClick={()=>{this.setControl('clear')}}>Clear</Pager.Item>
                </Pager>
                <Board ref="board" />
                <Pager>
                    <h4>Speed</h4>
                    <Pager.Item href="#" onClick={()=>{this.setSpeed('slow')}}>Slow</Pager.Item>
                    {' '}
                    <Pager.Item href="#" onClick={()=>{this.setSpeed('medium')}}>Medium</Pager.Item>
                    {' '}
                    <Pager.Item href="#" onClick={()=>{this.setSpeed('fast')}}>Fast</Pager.Item>
                </Pager>
            </div>
        );
    }
}

export default App;
