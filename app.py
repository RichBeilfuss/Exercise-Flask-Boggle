from boggle import Boggle
from flask import Flask, request, render_template, jsonify, session

boggle_game = Boggle()
app = Flask(__name__)
app.config["SECRET_KEY"] = "afiaojrjfnmcnf"


@app.route("/")
def homepage():
    """Create the board"""
    board = boggle_game.make_board()
    session["board"] = board
    highscore = session.get("highscore", 0)
    num_plays = session.get("num_plays", 0)

    return render_template("index.html", board=board, highscore = highscore, num_plays=num_plays)

@app.route("/check-word")
def check_word():
    """This checks the dictionary for the word in the guess"""
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({"result": response})

@app.route("/post-score", methods=["POST"])
def post_score():
    """Get the score, update the number of plays and check if this is highscore"""
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    num_plays = session.get("num_plays", 0)

    session["num_plays"] = num_plays+1
    session["highscore"] = max(score, highscore)

    return jsonify(newHigh = score>highscore)
