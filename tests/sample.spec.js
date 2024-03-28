const chai = require('chai');
const except = chai.expect;

const {samplemethod} = require('../controllers/board');

describe('testing handle save pin to board', () => {
    it('handle save pin to board', () => {
        const result = samplemethod();
        except(result).to.equal('hello');
    })
})