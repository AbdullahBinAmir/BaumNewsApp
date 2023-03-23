# Essential Imports
from flask import Flask
from flask_restful import Resource, Api , reqparse
from lib.load import load_recommendations, load_searched, load_recent, load_resources, load_publishers
import json
import logging
from apscheduler.schedulers.background import BackgroundScheduler
import os

# Define a function to run the Python script
# def run_script():
#     os.system("python lib/update_data.py")
#     load_resources()
# # Create a scheduler object
# scheduler = BackgroundScheduler()
# # Schedule the run_script function to run after 24 hours
# scheduler.add_job(run_script, 'interval', minutes=5)
# # Start the scheduler
# scheduler.start()

# Initializing API
app= Flask(__name__)
api = Api(app)

# requesest arguments
upload_parser = reqparse.RequestParser(bundle_errors=True)
upload_parser.add_argument("article_id", type=str, location='form')
upload_parser.add_argument("keyword", type=str, location= "form")
upload_parser.add_argument("date", type=str, location= "form")
upload_parser.add_argument("publisher", type=str, location= "form")

#logging
logging.basicConfig(filename='ArticleRecSystem.log', format='%(asctime)s : %(message)s')
# logging.disable(logging.INFO)
# logging.disable(logging.DEBUG)
# logging.disable(logging.WARNING)

# Endpoint class
class ArticelRecSystem(Resource):
    
    # endpoint post request
    def post(self):
        
        # receiving arguments
        args = upload_parser.parse_args()
        id = args["article_id"]
        
        # response to the request
        try:
            response = load_recommendations(int(id))
        except:
            response = {"Message" : "Recommendation error."}

        # logging request and response of post request
        logging.fatal("Recommendations\t: Request Body\t: {}".format(args))
        logging.fatal("Recommendations\t: Response Body\t: {}".format(response))

        return (response)
        
class SearchedArticle(Resource):
    def post(self):
        args = upload_parser.parse_args()
        keyword = args['keyword']

        # response to the request
        try:
            response = load_searched(keyword)
        except:
            response = {"Message" : "Searching error."}

        # logging request and response of post request
        logging.fatal("Search\t: Request Body\t: {}".format(args))
        logging.fatal("Search\t: Response Body\t: {}".format(response))

        return (response)

class ViewRecent(Resource):
    def post(self):
        args = upload_parser.parse_args()
        date = args['date']

        # response to the request
        try:
            response = load_recent(date)
        except:
            response = {"Message" : "Loading recent data error."}

        # logging request and response of post request
        logging.fatal("Recent\t: Request Body\t: {}".format(args))
        logging.fatal("Recent\t: Response Body\t: {}".format(response))

        return (response)

class Publishers(Resource):
    def post(self):

        args = upload_parser.parse_args()
        date = args['publisher']
        # response to the request
        try:
            response = load_publishers()
        except:
            response = {"Message" : "Loading publishers error."}

        # logging request and response of post request
        logging.fatal("Publishers\t: Request Body\t: {}".format(args))
        logging.fatal("Publishers\t: Response Body\t: {}".format(response))

        return (response) 

# adding endpoint
api.add_resource(ArticelRecSystem, "/Recommendations")
api.add_resource(SearchedArticle, "/Search")
api.add_resource(ViewRecent, "/Recent")
api.add_resource(Publishers, "/Publishers")

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)