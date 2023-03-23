import pandas as pd
import joblib
import numpy as np
# import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# VARIABLES
global org_data
global similarity,data_vector, sources
sources = pd.read_excel("data/Sources.xlsx", sheet_name="Sources", header=1)
org_data = pd.read_csv("data/Dataset.csv")
org_data["id"] = org_data["id"].apply(lambda x: str(x))
train_data = pd.read_csv('data/Tags.csv')
# similarity = joblib.load('model/newsapi_articles_cosinesimilarity.pkl')


# TFIDF Search
vectorizer = TfidfVectorizer()
data_vector = vectorizer.fit_transform(org_data["author"].fillna("")+ org_data["title"].fillna("")+ org_data["publishedAt"].fillna(""))

# TFIDF Recommendations
rec_vector = TfidfVectorizer(stop_words='english')
tfidf_matrix = rec_vector.fit_transform(train_data['tags'])

# calculating similarity
similarity = cosine_similarity(tfidf_matrix)

def load_resources():
    # TFIDF Search
    global similarity
    global data_vector

    vectorizer = TfidfVectorizer()
    data_vector = vectorizer.fit_transform(org_data["author"].fillna("")+ org_data["title"].fillna("")+ org_data["publishedAt"].fillna(""))

    # TFIDF Recommendations
    rec_vector = TfidfVectorizer(stop_words='english')
    tfidf_matrix = rec_vector.fit_transform(train_data['tags'])

    # calculating similarity
    similarity = cosine_similarity(tfidf_matrix)

# for loading recommendations
def load_recommendations(id):
    global similarity
    # getting inferencing
    scores = similarity[int(id)]
    # print(scores)
    #  Find the top 3 most similar documents
    top_indices = np.argsort(scores)[::-1][1:6]

    # extracting data of recommended documents
    heads = []
    paywal_list = []
    for i in top_indices:
        dictionary = {
            "id": str(i), 
            "source_name" : org_data['source_name'].iloc[i],
            "title": org_data['title'].iloc[i],
            "description": org_data['description'].iloc[i],
            "publishedAt": org_data['publishedAt'].iloc[i],
            # "content": org_data['content'].iloc[i],
            "url": org_data['url'].iloc[i],
            "PayWall" :  "unknown" if str(org_data['Paywall Value'].iloc[i]) == "nan" else org_data['Paywall Value'].iloc[i]
        }
        if dictionary['PayWall'] != "unknown":
            if org_data['source_name'].iloc[i] not in paywal_list:
                heads.append(dictionary)
                paywal_list.append(org_data['source_name'].iloc[i])
        else:
            heads.append(dictionary)
    return heads

# if the request is to get articles of recently posted.
def load_searched(keyword):

    global similarity,data_vector
    # getting similarity
    string_vector = vectorizer.transform([str(keyword)])
    cosine_similarities = (cosine_similarity(data_vector, string_vector)).flatten()
    
    #  Find the top 3 most similar documents
    top_indices = np.argsort(cosine_similarities)[::-1][:5]

    # with open("top.json", 'w') as xtext:
    #     json.dump(top_indices.tolist(), xtext)

    # print(cosine_similarities.tolist())
    heads = []
    paywal_list = []

    for i in top_indices:
        dictionary = {
            "id": str(i), #.values[0], 
            "source_name" : org_data['source_name'].iloc[i],
            "title": org_data['title'].iloc[i], #.values[0],
            "description": org_data['description'].iloc[i], #.values[0],
            "publishedAt": org_data['publishedAt'].iloc[i], #.values[0],
            # "content": org_data['content'].iloc[i], #.values[0],
            "url": org_data['url'].iloc[i], #.values[0]
            "PayWall" : "unknown" if str(org_data['Paywall Value'].iloc[i]) == "nan" else org_data['Paywall Value'].iloc[i]
        }
        if dictionary['PayWall'] != "unknown":
            if org_data['source_name'].iloc[i] not in paywal_list:
                heads.append(dictionary)
                paywal_list.append(org_data['source_name'].iloc[i])
        else:
            heads.append(dictionary)
    return heads

# view recent dataed articles
def load_recent(date= "27-02-2023"):
    new = org_data[org_data["publishedAt"] >= date].head(5)

    heads = []
    paywal_list = []
    if new.shape[0] == 0:
        dictionary = {
            "id": " ", 
            "source_name" : " ",
            "title": " ",
            "description": " ",
            "publishedAt": " ",
            "url": " ",
            "PayWall" : " "
        }
        heads.append(dictionary)
    else:         
        for i in range(new.shape[0]):
            dictionary = {
                "id": str(org_data[org_data['id']==new['id'].iloc[i]].head(1).index[0]),
                "source_name" : new['source_name'].iloc[i], 
                "title": new['title'].iloc[i],
                "description": new['description'].iloc[i],
                "publishedAt": new['publishedAt'].iloc[i],
                "url": new['url'].iloc[i],
                "PayWall" : "unknown" if str(new['Paywall Value'].iloc[i]) == "nan" else new['Paywall Value'].iloc[i]
            }
            if dictionary['PayWall'] != "unknown":
                if org_data['source_name'].iloc[i] not in paywal_list:
                    heads.append(dictionary)
                    paywal_list.append(org_data['source_name'].iloc[i])
            else:
                heads.append(dictionary)
    return heads

def load_publishers():
    # global sources
    # print(sources.head(0))
    df  = sources[['Parent Publisher Name', 'IsNews', 'Category']]
    heads = []
    for i in range(df.head(20).shape[0]):
        dictionary = {
            "id": str(i), #.values[0], 
            "Publisher": "unknown"  if str(df['Parent Publisher Name'].iloc[i]) == "nan" else str(df['Parent Publisher Name'].iloc[i]), #.values[0],
            "IsNews": "unknown"  if str(df['IsNews'].iloc[i]) == 'nan' else  str(df['IsNews'].iloc[i]), #.values[0],
            "interest": "unknown"  if str(df['Category'].iloc[i]) == "nan" else str(df['Category'].iloc[i])
        }
        heads.append(dictionary)
    return heads


