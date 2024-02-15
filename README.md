# Drag'n'Drop Language Model Training

## Introduction

Drag'n'Drop Language Model Training is a web application designed to allow users to train a primitive language model based off of their own text file. This project is split into two main components: the frontend and the backend. The frontend is built with TypeScript and React and styled using Chakra UI. The backend is developed using Python and Flask and is responsible for handling the training of the LM and generation of sentences.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (for the frontend)
- Python (for the backend)
- Git (for version control)

### Setup

First, clone the repository to your local machine:

```
git clone https://github.com/mattrwang/drag-n-drop-train.git
cd drag-n-drop-train
```

### Frontend

Navigate to the frontend directory:

```
cd client
```

Install the necessary node packages:

```
npm install
```

Start the development server:

```
npm start
```

The frontend should now be accessible at http://localhost:3000 (or another port, if specified).

### Backend

Navigate to the backend directory:

```
cd server
```

It's recommended to create a virtual environment:

```
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install the required Python packages:

```
pip install -r requirements.txt
```

Start the backend server:

```
python server.py
```

Now you should be all set!

## Notes

- This is a very primitive language model, if selecting the "Strong" and "Very Strong" strengths, often the sentences will be nonsense due to its nature.
- Sometimes the <UNK> token will appear. This is to indicate a word that appears _only once_ throughout the text file.
