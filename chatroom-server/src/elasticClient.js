const ELASTIC_INDEX_KEY = 'robo-chat';

class ElasticClient {
    client;
    constructor(client) {
        this.client = client;
    }

    createMessageDoc = async (message) => {
        await this.client.create({index: ELASTIC_INDEX_KEY, id: message.id, document: message});
    }

    getExistingAnswers = async (query) => {
        const response = await this.client.search({
            index: ELASTIC_INDEX_KEY,
            query: {
                query_string: {
                    query: query,
                    default_field: 'originalMessage.message',
                    fuzziness: 2,
                    minimum_should_match: '70%'
                }
            }
        });
        const result = response?.hits?.hits?.[0];
        if (result && result._score > 1.3) {
            console.log('found match to criteria', result);
            return { answer: result._source.message,
                question: result._source.originalMessage.message
            };
        }
        return null;
    }
}

module.exports = {ElasticClient}
