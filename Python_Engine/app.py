import streamlit as st
from lib.background import set_background
from lib.load import load_recommendations, load_searched, load_recent

# Define the style for the colored box
css = """
div.stButton > button:first-child {
    background-color: #f0f0f0;
    border: 2px solid #dbdbdb;
    border-radius: 10px;
    color: #000;
    font-size: 8px;
    font-weight: 50;
    padding: 4px 16px;
    transition: background-color 0.3s ease;
}
div.stButton > button:first-child:hover {
    background-color: #dbdbdb;
}
"""

# setting input
set_background('icons/bg.jpg')

# Display the CSS style
st.write("<head><link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Audiowide'><style>body { font-family: 'Audiowide', sans-serif; }</style></head>", unsafe_allow_html=True)

# title
st.write("<h1 style='text-align: center; font-family: Audiowide, sans-serif;'>Insight Digest: Nourish Your Mind with Engaging Articles</h1>", unsafe_allow_html=True)

# sidebar
st.sidebar.markdown("<h2 style = 'text-align: left;' >Recommended Articles:", unsafe_allow_html=True)
rec1 = st.sidebar.empty()
rec2 = st.sidebar.empty()
rec3 = st.sidebar.empty()
rec4 = st.sidebar.empty()
rec5 = st.sidebar.empty()

# Display the CSS style
st.write(f'<style>{css}</style>', unsafe_allow_html=True)

# heading 2
st.write("<h2 style='text-align: center;'>Today's Hot News</h2>", unsafe_allow_html=True)

# reading dataframe
whats_new = load_recent()

################################################################################

# Showing Category 
# st.write(f"<h4 style='text-align: left;'>{whats_new['category']}</h4>", unsafe_allow_html=True)

# Create two columns
col1, col2 = st.columns([1, 6])

# Add the st.info() box to the second column
with col2:
    st.info(whats_new[0]['title'])

# Add a button to the first column
if col1.button("Show more", key=1):
    col2.info(whats_new[0]['headline'])
    # print(f"{whats_new[0]['id']}")
    headlines = load_recommendations(whats_new[0]['id'])
    rec1.success(f"{headlines[0]['title']}")
    rec2.success(f"{headlines[1]['title']}")
    rec3.success(f"{headlines[2]['title']}")
    rec4.success(f"{headlines[3]['title']}")
    rec5.success(f"{headlines[4]['title']}")
    #################################################1

# Showing Category 
# st.write(f"<h4 style='text-align: left;'>{whats_new['category']}</h4>", unsafe_allow_html=True)

# Create two columns
col3, col4 = st.columns([1, 6])

# Add the st.info() box to the second column
with col4:
    st.info(whats_new[1]['title'])

# Add a button to the first column
if col3.button("Show more", key= 2):
    col4.info(whats_new[1]['headline'])
    headlines = load_recommendations(whats_new[1]["id"])
    rec1.success(f"{headlines[0]['title']}")
    rec2.success(f"{headlines[1]['title']}")
    rec3.success(f"{headlines[2]['title']}")
    rec4.success(f"{headlines[3]['title']}")
    rec5.success(f"{headlines[4]['title']}")
    #################################################2
# Showing Category 
# st.write(f"<h4 style='text-align: left;'>{whats_new['category']}</h4>", unsafe_allow_html=True)

# Create two columns
col5, col6 = st.columns([1, 6])

# Add the st.info() box to the second column
with col6:
    st.info(whats_new[2]['title'])

# Add a button to the first column
if col5.button("Show more", key= 3):
    col6.info(whats_new[2]['headline'])
    headlines = load_recommendations(whats_new[2]["id"])
    rec1.success(f"{headlines[0]['title']}")
    rec2.success(f"{headlines[1]['title']}")
    rec3.success(f"{headlines[2]['title']}")
    rec4.success(f"{headlines[3]['title']}")
    rec5.success(f"{headlines[4]['title']}")
    #################################################3
# Showing Category 
# st.write(f"<h4 style='text-align: left;'>{whats_new['category']}</h4>", unsafe_allow_html=True)

# Create two columns
col7, col8 = st.columns([1, 6])

# Add the st.info() box to the second column
with col8:
    st.info(whats_new[3]['title'])

# Add a button to the first column
if col7.button("Show more", key= 4):
    col8.info(whats_new[3]['headline'])
    headlines = load_recommendations(whats_new[3]["id"])
    rec1.success(f"{headlines[0]['title']}")
    rec2.success(f"{headlines[1]['title']}")
    rec3.success(f"{headlines[2]['title']}")
    rec4.success(f"{headlines[3]['title']}")
    rec5.success(f"{headlines[4]['title']}")
    #################################################4

# Showing Category 
# st.write(f"<h4 style='text-align: left;'>{whats_new['category']}</h4>", unsafe_allow_html=True)

# Create two columns
col9, col10 = st.columns([1, 6])

# Add the st.info() box to the second column
with col10:
    st.info(whats_new[4]['title'])
    
# Add a button to the first column
if col9.button("Show more", key= 5):
    col10.info(whats_new[4]['headline'])
    headlines = load_recommendations(whats_new[4]["id"])
    rec1.success(f"{headlines[0]['title']}")
    rec2.success(f"{headlines[1]['title']}")
    rec3.success(f"{headlines[2]['title']}")
    rec4.success(f"{headlines[3]['title']}")
    rec5.success(f"{headlines[4]['title']}")
    ##################################################5

