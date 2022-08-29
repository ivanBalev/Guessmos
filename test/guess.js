require('dotenv').config({ path: './.env.test' });
const { connect, disconnect } = require('../database');
const { expect } = require('chai');
const Guess = require('./../models/guess');
const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};

describe('guess model', function () {
  //   this.beforeEach(async () => await connect());
  //   this.afterEach(async () => await disconnect());

  it('colors words correctly', async function () {
    const dayWord = 'pesho';
    const word = 'oshep';

    const coloredWord = Guess.colorContent(word, dayWord);

    expect(coloredWord).to.satisfy(function (letters) {
      return letters.every(function (letter) {
        return letter.color === colors.yellow;
      });
    });
  });
});
