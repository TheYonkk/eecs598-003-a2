from flask import Flask, redirect, url_for, request, jsonify
from flask_cors import CORS, cross_origin

from transformers import pipeline

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

vqa_pipeline = pipeline("visual-question-answering")

@app.route("/")
def index():
    return "<p>Send some data to the /ask endpoint via a post request!</p>"

# Path: flask/app.py
@app.route("/ask", methods=["POST"])
@cross_origin()
def ask():

    # only allow POST requests
    if request.method != "POST":
        return "Only POST requests are allowed", 400

    # get the data from the request
    data = request.get_json()
    question = data["question"]
    image_link = data["image_url"]

    # check for missing or empty data. return 400 if missing.
    if question is None or image_link is None:
        return "Missing question or image link", 400
    elif question == "" or image_link == "":
        return "Empty question or image link", 400

    # run the pipeline and return the answers
    ans = vqa_pipeline(image_link, question)
    return jsonify(ans)
