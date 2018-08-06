import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

const etherUnit = 'ether';
let manager = '';


class App extends Component {
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: ''
    }
    async componentDidMount() {
        document.title = 'Lottery application';
        if (web3 === undefined) {
            return;
        }
        manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({
            manager: manager,
            players: players,
            balance: balance,
            value: '',
            message: ''
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        this.setState({message: 'Waiting on transaction success...'});
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, etherUnit)
            });
            const players = await lottery.methods.getPlayers.call();
            const balance = await web3.eth.getBalance(lottery.options.address);
            this.setState({
                manager: manager,
                players: players,
                balance: balance,
                value: '',
                message: 'You have been entered!'
            });
        } catch (error) {
            this.setState({message: 'The transaction couldnot complete successfully'});
            console.log(error);
        }   
    }

    onClick = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({message: 'Waiting on transaction success...'});
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            this.setState({
                manager: manager,
                players: [],
                balance: '0',
                value: '',
                message: 'A winner has been picked!'
            });
        } catch (error) {
            this.setState({message: 'The transaction couldnot complete successfully'});
            console.log(error);
        }
        
    }

    render() {
        if (web3 === undefined) {
            alert('Please install and login metamask extension!');
            return (
                <div className="App">        
                </div>
            );
        }
        return (
            <div className="App">
                <h2>Lottery contract</h2>
                <p>This contract is managed by {this.state.manager}.</p>
                <p>There are currently {this.state.players.length} people (person)
         entered competing to win {web3.utils.fromWei(this.state.balance, etherUnit)} ether</p>
                <hr/>
                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck ?</h4>
                    <div>
                        <label>Amount of ether to enter</label>
                        <input value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </div>
                    <button>Sign me up!</button>
                </form>
                <hr/>
                <h4>{this.state.message}</h4>
                <hr/>
                <h4>Let's pick a winner</h4>
                <button onClick={this.onClick}>Pick a Winner</button>
            </div>
        );
    }
}

export default App;
