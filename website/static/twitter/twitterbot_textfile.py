import tweepy

# Import our Twitter credentials from credentials.py
from credentials import *

# Access and authorize our Twitter credentials from credentials.py
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

print(type(api))           # <class 'tweepy.api.API'>
# get latest 20 tweets from your own timeline
home_tweets = api.user_timeline()
tweet = home_tweets[0]
print(type(tweet))
user = api.get_user('artblot', include_entities=2)
# print(type(user))               # <class 'tweepy.models.User'>
# print(user.id)            # 13982132
print(user.name)          # MIT Media Lab
# print(user.screen_name)   # medialab
# print(user.created_at)    # 2008-02-26 03:06:21
#print(user.description)   # News from the MIT Media Lab
print(user.status.text)   # News from the MIT Media Lab
