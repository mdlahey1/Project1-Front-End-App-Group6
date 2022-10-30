//URL and key variables for TMDB API to get MovieID and Return Details
apiKey = 'a6091da1f77938caf706363106cf0289';
var tmdbGetIdUrl ='https://api.themoviedb.org/3/search/movie?api_key=';
var tmdbGetDetailsUrl = 'https://api.themoviedb.org/3/movie/'
var tmdbGetRecommendationsUrl = 'https://api.themoviedb.org/3/movie/';


//Element variables in order to appendchild and add the searched movie/TV show Card and similar Movie/TV show recommendation Cards
var userSearchInput = document.querySelector('#userSearchInput');
var userSearchForm = document.querySelector('#userSearchForm');
var searchBtn = document.querySelector('#searchBtn');
var searchedMovieCard = document.querySelector('#searchedMovieCard');
var similarMovieCards = document.querySelector('#similarMovieCards');

//Create an event handler for when the user clicks the search button
var searchButtonHandler = function(event) {
    event.preventDefault();
    //Get the value of the users search
    var userSearchValue = userSearchInput.value.trim();
    console.log(userSearchValue);

    //Call the function to the get movie ID if it's the user does not hit search without inputting a value (can also easily add history buttons here later on)
    if (userSearchValue) {
        //Call the getMovieID function
        getMovieId(userSearchValue);
        //Reset the search input to blank
        userSearchInput.value = ""
    } 
    //Need to update this to be a modal instead of an alert but using that as a placeholder for now
    else {
        alert("Please enter a valid Movie title")
    }
};

//Create a function that will return the Movie ID
function getMovieId(userSearchValue) {
    //Update the root URL to incorporate the API key and User Search Value
    var fetchUrl = tmdbGetIdUrl + apiKey + "&query=" + userSearchValue;
    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
        });
};

userSearchForm.addEventListener("submit", searchButtonHandler);