from flask import Flask, request, jsonify
from flask_cors import CORS
import lm_model as lm
from lm_model import LanguageModel

app = Flask(__name__)
CORS(app)


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    file = data['fileContent'].split('\n')
    strength = data['strength']
    num_sentences = data['num_sentences']

    model = LanguageModel(strength)
    tokens = lm.tokenize(file, strength, by_char=False)
    model.train(tokens)
    generated = model.generate(num_sentences)

    sentences = []

    formatted = []

    for sentence in generated:
        format_sentence = [
            word for word in sentence if word != '<s>' and word != '</s>']
        formatted.append(format_sentence)

    for sentence in formatted:
        sentences.append(' '.join(sentence))

    return jsonify({'sentences': sentences})


if __name__ == '__main__':
    app.run(debug=True)
