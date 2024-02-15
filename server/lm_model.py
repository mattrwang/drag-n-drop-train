from collections import Counter, defaultdict
import numpy as np
import math

# constants
SENTENCE_BEGIN = "<s>"
SENTENCE_END = "</s>"
UNK = "<UNK>"


# UTILITY FUNCTIONS

def create_ngrams(tokens: list, n: int) -> list:
    """Creates n-grams for the given token sequence.
    Args:
      tokens (list): a list of tokens as strings
      n (int): the length of n-grams to create

    Returns:
      list: list of tuples of strings, each tuple being one of the individual n-grams
    """
    ngrams = []
    for i in range(len(tokens) - n + 1):
        ngram = tuple(tokens[i:i + n])
        ngrams.append(ngram)
    return ngrams


def read_file(path: str) -> list:
    """
    Reads the contents of a file in line by line.
    Args:
      path (str): the location of the file to read

    Returns:
      list: list of strings, the contents of the file
    """
    f = open(path, "r", encoding="utf-8")
    contents = f.readlines()
    f.close()
    return contents


def tokenize_line(line: str, ngram: int,
                  by_char: bool = True,
                  sentence_begin: str = SENTENCE_BEGIN,
                  sentence_end: str = SENTENCE_END):
    """
    Tokenize a single string. Glue on the appropriate number of 
    sentence begin tokens and sentence end tokens (ngram - 1), except
    for the case when ngram == 1, when there will be one sentence begin
    and one sentence end token.
    Args:
      line (str): text to tokenize
      ngram (int): ngram preparation number
      by_char (bool): default value True, if True, tokenize by character, if
        False, tokenize by whitespace
      sentence_begin (str): sentence begin token value
      sentence_end (str): sentence end token value

    Returns:
      list of strings - a single line tokenized
    """
    inner_pieces = None
    if by_char:
        inner_pieces = list(line)
    else:
        # otherwise split on white space
        inner_pieces = line.split()

    if ngram == 1:
        tokens = [sentence_begin] + inner_pieces + [sentence_end]
    else:
        tokens = ([sentence_begin] * (ngram - 1)) + \
            inner_pieces + ([sentence_end] * (ngram - 1))
    # always count the unigrams
    return tokens


def tokenize(data: list, ngram: int,
             by_char: bool = True,
             sentence_begin: str = SENTENCE_BEGIN,
             sentence_end: str = SENTENCE_END):
    """
    Tokenize each line in a list of strings. Glue on the appropriate number of 
    sentence begin tokens and sentence end tokens (ngram - 1), except
    for the case when ngram == 1, when there will be one sentence begin
    and one sentence end token.
    Args:
      data (list): list of strings to tokenize
      ngram (int): ngram preparation number
      by_char (bool): default value True, if True, tokenize by character, if
        False, tokenize by whitespace
      sentence_begin (str): sentence begin token value
      sentence_end (str): sentence end token value

    Returns:
      list of strings - all lines tokenized as one large list
    """
    total = []
    # also glue on sentence begin and end items
    for line in data:
        line = line.strip()
        # skip empty lines
        if len(line) == 0:
            continue
        tokens = tokenize_line(line, ngram, by_char,
                               sentence_begin, sentence_end)
        total += tokens
    return total


class LanguageModel:

    def __init__(self, n_gram):
        """Initializes an untrained LanguageModel
        Args:
          n_gram (int): the n-gram order of the language model to create
        """
        # set n_gram, vocab, ngram_counts, vocab_size, context_counts
        self.n_gram = n_gram
        self.vocab = set()
        self.ngram_counts = defaultdict(lambda: 0)
        self.vocab_size = 0
        self.context_counts = defaultdict(lambda: 0)

    def train(self, tokens: list, verbose: bool = False) -> None:
        """Trains the language model on the given data. Assumes that the given data
        has tokens that are white-space separated, has one sentence per line, and
        that the sentences begin with <s> and end with </s>
        Args:
          tokens (list): tokenized data to be trained on as a single list
          verbose (bool): default value False, to be used to turn on/off debugging prints
        """
        # put UNK for tokens that appear only once
        tokens_counter = Counter(tokens)
        tokens_list = [token if tokens_counter[token]
                       > 1 else UNK for token in tokens]

        # set vocab and size
        self.vocab = set(tokens_list)
        self.vocab_size = len(self.vocab)

        # create ngrams and set counts
        ngrams = create_ngrams(tokens_list, self.n_gram)
        for ngram in ngrams:
            self.ngram_counts[ngram] += 1
            if self.n_gram > 1:
                context = ngram[:-1]
                self.context_counts[context] += 1

        if self.n_gram == 1:
            self.context_counts[()] = len(tokens_list)

        if verbose:
            print("ngrams: ", self.ngram_counts)
            print("vocab size: ", len(self.vocab))

    def score(self, sentence_tokens: list) -> float:
        """Calculates the probability score for a given string representing a single sequence of tokens.
        Args:
          sentence_tokens (list): a tokenized sequence to be scored by this model

        Returns:
          float: the probability value of the given tokens for this model
        """
        # initialize probability to 1.0 and set tokens to UNK if not in vocab
        probability = 1.0
        tokens_unk = [
            token if token in self.vocab else UNK for token in sentence_tokens]
        ngrams = create_ngrams(tokens_unk, self.n_gram)
        # calculate probability
        for ngram in ngrams:
            count = self.ngram_counts[ngram]
            context = ngram[:-1] if self.n_gram > 1 else ()
            context_count = self.context_counts[context]
            probability *= (count + 1) / (context_count + self.vocab_size)

        return probability

    def generate_sentence(self) -> list:
        """Generates a single sentence from a trained language model using the Shannon technique.

        Returns:
          list: the generated sentence as a list of tokens
        """
        sentence = [SENTENCE_BEGIN]
        # unigrams
        if self.n_gram == 1:
            # generate tokens based off of the unigram counts
            probabilities = [self.ngram_counts[(
                word,)] if word != SENTENCE_BEGIN else 0 for word in self.vocab]
            # ensure that the probabilities sum to 1
            sum = np.sum(probabilities)
            probabilities = [prob / sum for prob in probabilities]
            # generate tokens until the end token is reached
            while sentence[-1] != SENTENCE_END:
                token = np.random.choice(list(self.vocab), p=probabilities)
                sentence.append(token)
        # bigrams
        elif self.n_gram == 2:
            # generate tokens based off of the token before
            while sentence[-1] != SENTENCE_END:
                # get the valid next tokens
                valid_nexts = [
                    bigram[1] for bigram in self.ngram_counts.keys() if bigram[0] == sentence[-1]]
                # get the probabilities of each token
                probabilities = [
                    self.ngram_counts[(sentence[-1], word)] for word in valid_nexts]
                # ensure that the probabilities sum to 1
                sum = np.sum(probabilities)
                probabilities = [prob / sum for prob in probabilities]
                token = np.random.choice(valid_nexts, p=probabilities)
                sentence.append(token)
        # trigrams and more
        else:
            # generate the first n-1 tokens
            while len(sentence) < self.n_gram - 1:
                length = len(sentence)
                valid_nexts = [ngram[1] for ngram in self.ngram_counts.keys(
                ) if ngram[:length] == tuple(sentence)]
                token = np.random.choice(valid_nexts)
                sentence.append(token)
            # generate tokens based off of the n-1 tokens before
            while sentence[-1] != SENTENCE_END:
                # get the context
                context = tuple(sentence[-self.n_gram + 1:])
                # get the valid next tokens
                valid_nexts = [
                    ngram[-1] for ngram in self.ngram_counts.keys() if ngram[:-1] == context]
                # if there are no valid nexts, add the end token and break
                if not valid_nexts:
                    sentence.append(SENTENCE_END)
                    break
                # get the probabilities of each token
                probabilities = [
                    self.ngram_counts[context + (word,)] for word in valid_nexts]
                # ensure that the probabilities sum to 1
                sum = np.sum(probabilities)
                probabilities = [prob / sum for prob in probabilities]
                token = np.random.choice(valid_nexts, p=probabilities)
                sentence.append(token)

        return sentence

    def generate(self, n: int) -> list:
        """Generates n sentences from a trained language model using the Shannon technique.
        Args:
          n (int): the number of sentences to generate

        Returns:
          list: a list containing lists of strings, one per generated sentence
        """
        return [self.generate_sentence() for i in range(n)]

    def perplexity(self, sequence: list) -> float:
        """Calculates the perplexity score for a given sequence of tokens.
        Args:
          sequence (list): a tokenized sequence to be evaluated for perplexity by this model

        Returns:
          float: the perplexity value of the given sequence for this model
        """
        score = self.score(sequence)
        length = len(sequence)
        return math.pow(score, -1/length)
