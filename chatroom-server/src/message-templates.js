const tellJoke = '-make me laugh';

module.exports = {
    TELL_JOKE: () =>  tellJoke,
    GREETING:({username, joke}) => `Hey There ${username} Welcome To This Amazing Robo Chat \n I'm Robbie and i can do stupid things like tell you a joke.\n for example: ${joke} \n for another one send ${tellJoke}`,
    FOUND_POSSIBLE_ANSWER: ({question, answer}) => `While you wait for others, i searched for questions that might be relevant for your question.
The question was: ${question}
And the answer they gave:
${answer}`
}
