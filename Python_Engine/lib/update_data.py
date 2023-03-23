# imports 
import pandas as pd
import numpy as np
import json
import requests
import wikipediaapi
import feedparser
import signal
from dateutil import parser
import os

# loading previous data
if os.path.exists("data/Dataset.csv"):
    org_data = pd.read_csv("data/Dataset.csv")
    org_data.drop(columns=['id'], axis=1, inplace=True)
else:
    org_data = pd.DataFrame()

# reading links file
links = pd.read_excel("data/Sources.xlsx", header=1)
wiki_links = pd.read_excel('data/Sources.xlsx', sheet_name='Wiki Categories', header=1)

# getting new data from newsapi and processing it 

# news api url
URL = "https://newsapi.org/v2/everything?"

links['News API 2'] = links['News API 2'].apply(lambda x: str(x).split('=')[1] if x is not np.nan else np.nan)

#creating a dataframe
dataset_newsapi = pd.DataFrame()

# getting data from each link
for index, link_item in enumerate(links['News API Link'].values):
    # parameters for request
    PARAMS = {
    'domains': f"{link_item}",
    'apikey' : "31a644adf7964db285900d5fc0cd2f30" if str(links['News API 2'].iloc[index]) is not None else "31a644adf7964db285900d5fc0cd2f30"
    }

    # sending get request and saving the response as response object
    r = requests.get(url = URL, params = PARAMS)
    
    # extracting data in json format
    data = r.json()
    if 'totalResults' in data.keys():    
        if data["totalResults"] > 1:
            json_data = pd.read_json(json.dumps(data))
            dict_df = pd.json_normalize(json_data['articles'])
            dataset_newsapi = pd.concat([dataset_newsapi, dict_df], ignore_index=True)
            dataset_newsapi['Paywall Value'] = links['Paywall Value'].iloc[index] if links['Paywall Value'].iloc[index] is not np.nan else np.nan
    else:
        continue
    # if dataset_newsapi.shape[0] > 0:
    #     break

dataset_newsapi.rename(columns={"source.name": "source_name"}, inplace=True)
dataset_newsapi = dataset_newsapi[['source_name', 'title', 'description', 'url', 'publishedAt', 'author', 'Paywall Value']]
dataset_newsapi['publishedAt'] = dataset_newsapi['publishedAt'].apply(lambda x: str(parser.parse(x, fuzzy=True).strftime("%d-%m-%Y")) if x is not np.nan else np.nan)

# getting new data from RSS Feed

fetch_rss_df = links[["Website Name", "RSS Feed Link", "Paywall Value"]]
fetch_rss_df.dropna(inplace=True)

def handler(signum, frame):
    raise Exception("Execution timed out")

signal.signal(signal.SIGALRM, handler)

# set a maximum time limit of 10 seconds for each line of code
signal.alarm(120)


dataset_feedrss = pd.DataFrame()
for i in range(fetch_rss_df.shape[0]):
    signal.alarm(10)
    rss_url = fetch_rss_df['RSS Feed Link'].iloc[i] # replace with the URL of your RSS feed
    try:
        feed = feedparser.parse(rss_url)
        articles = []
        for entry in feed.entries:
            article = {
            "source_name" : fetch_rss_df['Website Name'].iloc[i],
            "title": entry.title if "title" in entry.keys() else None,
            "url": entry.link if "link" in entry.keys() else None,
            "publishedAt": entry.published if "published" in entry.keys() else (entry.pubDate if "pubDate" in entry.keys() else None),
            "author" : entry.author if "author" in entry.keys() else None,
            "description" : entry.description if "description" in entry.keys() else None
            }
            articles.append(article)
        dataset_feedrss = pd.concat([dataset_feedrss, pd.DataFrame(articles)])
        dataset_feedrss['Paywall Value'] = fetch_rss_df['Paywall Value'].iloc[i] if fetch_rss_df['Paywall Value'].iloc[i] is not np.nan else np.nan
        signal.alarm(0)
    except:
        signal.alarm(0)
    # break
dataset_feedrss['publishedAt'] = dataset_feedrss['publishedAt'].apply(lambda x: str(parser.parse(x, fuzzy=True).strftime("%d-%m-%Y")) if x is not np.nan else np.nan)

# collection of data from wikipedia


# Set up the Wikipedia API
wiki = wikipediaapi.Wikipedia('en')

dataset_wiki = pd.DataFrame()
for i, category in enumerate(wiki_links['Wiki Categories'].values):
    try:
        # Set the category you want to download articles from
        category_name = 'Category:{}'.format(category)

        # Get the category page and its members (articles)
        category_page = wiki.page(category_name)
        category_members = category_page.categorymembers

        # Loop through the members and download each article
        articles = []
        for member in category_members.values():
            # Check if the member is an article (not a subcategory)
            if member.ns == wikipediaapi.Namespace.MAIN:
                # Get the article content and save it to a file
                article = {
                    "source_name" : 'wikipedia',
                    "title" : member.title,
                    'description' : wiki.page(member.title).text.split('\n')[0],
                    'url' : wiki.page(member.title).fullurl,
                    'publishedAt' : None,
                    'author' : None,
                    'Paywall Value' : None
                }
                articles.append(article)
        dataset_wiki = pd.concat([dataset_wiki, pd.DataFrame(articles)])
        # print("index {}".format(str(dataset_wiki.shape[0])+ " : " + str(i)), end="\r")
    except:
        pass
    # break

dataset = pd.concat([dataset_newsapi, dataset_feedrss, dataset_wiki])

dataset = pd.concat([dataset, org_data], ignore_index=True)

dataset['publishedAt'] = dataset['publishedAt'].apply(lambda x: str(parser.parse(x, fuzzy=True).strftime("%d-%m-%Y")) if x is not np.nan else np.nan)

dataset = dataset.drop_duplicates()

dataset.reset_index(drop=False, inplace=True)

dataset.rename(columns={"index": "id"}, inplace=True)

dataset.to_csv("data/Dataset.csv", index = False)

dataset.drop(columns=["description", "url", "Paywall Value", "source_name"], axis=1, inplace=True)

dataset['tags'] = dataset['author'].fillna('')+ " " + dataset['title'].fillna('')+ " " + dataset['publishedAt'].fillna('')
dataset.drop(columns=["author", "title", "publishedAt"], inplace=True)
dataset["tags"] = dataset["tags"].apply(lambda x: x.lower())
dataset["tags"] = dataset["tags"].apply(lambda x: x.replace("— ", ""))
dataset["tags"] = dataset["tags"].apply(lambda x: x.replace(":", ""))

dataset.to_csv("data/Tags.csv", index=False)

del dataset


# vectorizer  = TfidfVectorizer(stop_words='english')
# tfidf_matrix = vectorizer.fit_transform(dataset['tags'])

# similarity = cosine_similarity(tfidf_matrix)

# # save cosine similarity in a model file
# joblib.dump(similarity, 'model/article_recommendations.pkl')
