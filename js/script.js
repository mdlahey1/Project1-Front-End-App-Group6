//URL and key variables for TMDB API to get MovieID and Return Details
apiKey = 'a6091da1f77938caf706363106cf0289';
var tmdbGetIdUrl ='https://api.themoviedb.org/3/search/movie?api_key=';
var tmdbGetDetailsUrl = 'https://api.themoviedb.org/3/movie/'
var tmdbGetRecommendationsUrl = 'https://api.themoviedb.org/3/movie/';


//Element variables in order to appendchild and add the searched movie/TV show Card and similar Movie/TV show recommendation Cards
var userSearchInput = document.querySelector('#userSearchInput');
var userSearchForm = document.querySelector('#userSearchForm');
var searchBtn = document.querySelector('#searchBtn');
var searchHistoryCard = document.querySelector('#searchHistoryCard');
var searchHistoryButtons = document.querySelector('#searchHistoryButtons');
var searchedMovieCard = document.querySelector('#searchedMovieCard');
var searchedMovieImage = document.querySelector('#searchedMovieImage');
var searchedMovieTitle = document.querySelector('#searchedMovieTitle');
var searchedMovieBody = document.querySelector('#searchedMovieBody');
var similarMovieCards = document.querySelector('#similarMovieCards');
var searchHistoryArr = [];
//Create an event handler for when the user clicks the search button
var searchButtonHandler = function(event) {
    event.preventDefault();
    //Get the value of the users search
    var userSearchValue = userSearchInput.value.trim();
    console.log(userSearchValue);

    //Call the function to the get movie ID if it's the user does not hit search without inputting a value (can also easily add history buttons here later on)
    if (userSearchValue) {
        //Save search in local storage and create search history button
        searchHistoryArr.push(userSearchValue);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
        
        //Create a new button element and append it
        var newHistoryBtn = document.createElement('button');
        newHistoryBtn.className = "btn";
        newHistoryBtn.setAttribute("movieName", userSearchValue);
        newHistoryBtn.innerHTML = userSearchValue;
        searchHistoryButtons.appendChild(newHistoryBtn);
        searchHistoryCard.classList.remove("hidden");

        //Call the getMovieID function and reset the search text area to blank
        getSearchedMovie(userSearchValue);
        //Reset the search input to blank
        userSearchInput.value = "";
    } 
    //Need to update this to be a modal instead of an alert but using that as a placeholder for now
    else {
        alert("Please enter a valid Movie title")
    }
};

//Create a function that will return the Movie ID
function getSearchedMovie(userSearchValue) {
    //Update the root URL to incorporate the API key and User Search Value
    var fetchUrl = tmdbGetIdUrl + apiKey + "&query=" + userSearchValue;
    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            //create variables to store from the API response
            var movieId = response.results[0].id;
            var movieTitle = response.results[0].title;
            var movieDescrip = response.results[0].overview;
            var movieImg = response.results[0].poster_path;
            var releaseDate = dayjs(response.results[0].release_date).format("MM/DD/YYYY");
            console.log(movieId);
            console.log(movieTitle);
            console.log(movieImg);

            //Update the movie Image
            searchedMovieImage.setAttribute("src", "https://image.tmdb.org/t/p/original" + movieImg);
            searchedMovieImage.setAttribute("alt", movieTitle)
            //Update the movie Title
            searchedMovieTitle.innerHTML = movieTitle;
            //Create an element to store the description and append to the body
            var newDescrip = document.createElement('p');
            newDescrip.innerHTML = "<strong>Description: </strong>" + movieDescrip;
            searchedMovieBody.appendChild(newDescrip);
            //Create an element to store the release date
            var release = document.createElement('p');
            release.innerHTML = "<strong>Release Date: </strong>" + releaseDate;
            searchedMovieBody.appendChild(release);
            //Unhid the searched movie card
            searchedMovieCard.classList.remove("hidden");
        })
};

userSearchForm.addEventListener("submit", searchButtonHandler);