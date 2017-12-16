import React from 'react';
import Board from '../components/Board';
import dataModel from '../fixtures/dataModel';
import database from '../firebase/firebase';

export default class BoardContainer extends React.Component {
  static dbPush() {
    dataModel.forEach(data =>
      database
        .ref('cards')
        .push(data)
        .then(console.log('pushed?')), );
  }
  constructor() {
    super();
    this.state = {
      cards: [],
    };
  }

  componentDidMount = () => {
    this.dbFetch();
  };

  dbFetch = () => {
    const cardsRef = database.ref('cards').orderByKey();
    cardsRef.once('value').then((snapshot) => {
      const cards = [];
      snapshot.forEach((childSnapshot) => {
        cards.push({
          ...childSnapshot.val(),
          id: childSnapshot.key,
        });
      });
      this.setState(() => ({ cards }));
    });
  };

  addTask = (cardId, taskName) => {
    console.log('add Task');
  };
  deleteTask = (cardId, taskId, taskIndex) => {
    const cardIndex = this.state.cards.findIndex(card => card.id === cardId);

    // Create a new object without the task
    const cards = { ...this.state.cards };
    cards[cardIndex].tasks.splice(taskIndex, 1);
    console.log(cards);
    this.setState(cards);
  };
  toggleTask = (cardId, taskId, taskIndex) => {
    console.log('toggle task');
  };

  render() {
    return (
      <div>
        <button onClick={BoardContainer.dbPush}>Add data</button>
        <Board
          cards={this.state.cards}
          taskCallbacks={{
            toggle: this.toggleTask,
            delete: this.deleteTask,
            add: this.addTask,
          }}
        />
      </div>
    );
  }
}
