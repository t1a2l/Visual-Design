# Visual Design

A react app that loads a json file from the "public" folder and pinpoint the location
of companies around the world using google maps.

Countries are sorted by number of cities, cities are sorted by the number of companies 
and companies are sorted alphabetically.

Special libraries used:
"axios" - loading of the json file.
"google-maps-react" - display a small map with a marker of the location of the company.
"react-geocode" - turns a text address into latitude and longitude.

Please use the "google-maps-react" node module added to this repository.

"google-maps-react" and "react-geocode" require an API key to work -
Go to App.js in lines 27 and 85 there is a message: "Put your API key here",
Replace the text with the API key.




