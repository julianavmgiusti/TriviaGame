import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addScore, setAssertions } from '../redux/actions';
import './game.css';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      isDisabled: true,
      timer: 30,
      answers: [],
      rightAnswer: '',
      next: false,
      lastQuestion: false,
      assertions: 0,
    };
  }

  componentDidMount = () => {
    const { count } = this.state;
    const { results } = this.props;
    this.handleInterval();
    const buttons = this.handleAlternatives(count);
    this.setState({
      answers: buttons,
      rightAnswer: results[count].correct_answer,
    });
  }

  componentWillUnmount = () => {
    this.handleInterval();
  }

  handleClick = ({ target }) => {
    this.changeColor();
    this.answerClick(target);
  }

  changeColor = () => {
    const correct = document.querySelector('.correct');
    const wrong = document.getElementsByClassName('wrong');
    correct.style.border = '3px solid rgb(6, 240, 15)';
    for (let i = 0; i < wrong.length; i += 1) {
      wrong[i].style.border = '3px solid rgb(255, 0, 0) ';
    }
    this.setState({
      next: true,
    });
  }

    answerClick = (target) => {
      const correct = document.querySelector('.correct');
      const { sumScore } = this.props;
      const { timer } = this.state;
      const dez = 10;
      const mult = this.difficultyValue();
      if (target === correct) {
        sumScore((dez + (timer * mult)));
        this.setState((prevState) => ({
          assertions: prevState.assertions + 1,
        }));
      }
    };

    difficultyValue = () => {
      const { props: { results }, state: { count } } = this;
      const multi = results[count].difficulty;
      const HARD = 3;

      switch (multi) {
      case 'hard':
        return HARD;
      case 'medium':
        return 2;
      case 'easy':
        return 1;
      default:
        return 1;
      }
    };

    handleInterval = () => {
      const fiveSeconds = 5000;
      const thirtySeconds = 30000;
      const one = 1000;
      setTimeout(() => {
        this.setState({ isDisabled: false });
      }, fiveSeconds);
      setTimeout(() => {
        this.setState({ isDisabled: true });
        this.changeColor();
      }, thirtySeconds);

      const count = setInterval(() => {
        this.setState((prevState) => {
          if (prevState.timer === 1) clearInterval(count);
          return { timer: prevState.timer - 1,
          };
        });
      }, one);
    };

  handleAlternatives = (count) => {
    const { results } = this.props;
    const meio = 0.5;
    const array = [...results[count].incorrect_answers, results[count].correct_answer];
    return array
      .sort(() => Math.random() - meio);
  }

  nextQuestion = () => {
    const { count } = this.state;
    const forNum = 4;
    if (count < forNum) {
      this.setState((prevState) => ({
        count: prevState.count + 1,
        timer: 30,
        next: false,
      }), () => {
        const { props: { results } } = this;
        const buttons = this.handleAlternatives(count);
        this.setState({
          answers: buttons,
          rightAnswer: results[count].correct_answer,
        });
        const correct = document.querySelector('.correct');
        const wrong = document.getElementsByClassName('wrong');
        correct.style.border = '';
        for (let i = 0; i < wrong.length; i += 1) {
          wrong[i].style.border = '';
        }
      });
    } else {
      const { assertionsQuestions } = this.props;
      const { assertions } = this.state;
      this.setState({ lastQuestion: true }, () => assertionsQuestions(assertions));
    }
  }

  render() {
    const {
      count,
      timer,
      answers,
      rightAnswer,
      isDisabled,
      next,
      lastQuestion } = this.state;
    const { results } = this.props;
    return (
      <div className="gameSheet">
        { results && (
          <section className="gameChart">
            <h1 data-testid="question-category">
              {
                results[count].category
              }
            </h1>
            <p className="question" data-testid="question-text">
              {
                results[count].question
              }
            </p>
            <section>
              <div data-testid="answer-options">
                {
                  answers.map((answer, i) => {
                    if (answer === rightAnswer) {
                      return (
                        <button
                          type="button"
                          data-testid="correct-answer"
                          id="correct"
                          key={ i }
                          className="correct btnAnswer"
                          onClick={ this.handleClick }
                          disabled={ isDisabled }
                        >
                          { answer }
                        </button>);
                    }
                    return (
                      <button
                        data-testid={ `wrong-answer-${i}` }
                        type="button"
                        key={ i }
                        className="wrong btnAnswer"
                        onClick={ this.handleClick }
                        disabled={ isDisabled }
                      >
                        { answer }
                      </button>
                    );
                  })
                }
              </div>
              { next
                && (
                  <button
                    className="btNext"
                    type="button"
                    data-testid="btn-next"
                    onClick={ this.nextQuestion }
                  >
                    Next
                  </button>
                ) }
            </section>
            <section>
              {timer}
            </section>
          </section>)}
        {lastQuestion && (
          <Redirect to="/feedback" />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  sumScore: (score) => dispatch(addScore(score)),
  assertionsQuestions: (assertions) => dispatch(setAssertions(assertions)),
});

Game.propTypes = {
  results: propTypes.arrayOf(propTypes.object),
}.isRequired;

export default connect(null, mapDispatchToProps)(Game);
