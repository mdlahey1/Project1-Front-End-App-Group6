//URL and key variables for TMDB API to get MovieID and Return Details
apiKey = 'a6091da1f77938caf706363106cf0289';
var tmdbGetIdUrl ='https://api.themoviedb.org/3/search/movie?api_key=';
var tmdbGetDetailsUrl = 'https://api.themoviedb.org/3/movie/'
var tmdbGetRecommendationsUrl = 'https://api.themoviedb.org/3/movie/';
var omdbGetDetailsUrl = 'https://www.omdbapi.com/?apikey=14195f60&t=';


//Element variables in order to appendchild and add the searched movie/TV show Card and similar Movie/TV show recommendation Cards
var userSearchInput = document.querySelector('#userSearchInput');
var userSearchForm = document.querySelector('#userSearchForm');
var searchBtn = document.querySelector('#searchBtn');
var searchHistoryCard = document.querySelector('#searchHistoryCard');
var searchHistoryButtons = document.querySelector('#searchHistoryButtons');
var searchedMovieCard = document.querySelector('#searchedMovieCard');
var searchedMovieImage = document.querySelector('#searchedMovieImage');
var searchedMovieBody = document.querySelector('#searchedMovieBody');
var recContainer = document.querySelector('#recContainer');
var noRecs = document.querySelector('#noRecs');
var recommendationSection = document.querySelector('#recommendationSection');
var errorMessage = document.querySelector('#errorMessage');
var modalCloseBtn = document.querySelector('#modalCloseBtn');
var localStorageArr = [];

//Create an event handler for when the user clicks the search button
var searchButtonHandler = function(event) {
    event.preventDefault();
    //Get the value of the users search
    var userSearchValue = userSearchInput.value.trim();
    // console.log(userSearchValue);
    myList = JSON.parse(localStorage.getItem("movieHistory"))
    //Call the function to the get movie ID as long as the user does not hit search without inputting a value
    if (userSearchValue) {
        //Test to see if this is there is no existing local storage (search has never been run)
        if (!myList) {
            localStorageArr.push(userSearchValue);
            var updatedHistory = JSON.stringify(localStorageArr);
            window.localStorage.setItem("movieHistory", updatedHistory);
            //Create a new button element and append it
            var newHistoryBtn = document.createElement('button');
            newHistoryBtn.className = "btn";
            newHistoryBtn.setAttribute("id", userSearchValue);
            newHistoryBtn.innerHTML = userSearchValue;
            searchHistoryButtons.appendChild(newHistoryBtn);
            searchHistoryCard.classList.remove("hidden");
        //Test to see if the search value is already in local storage i.e. don't create a button
        } else if (!myList.includes(userSearchValue)) {
            //Save search in local storage and create search history button
            myList = JSON.parse(localStorage.getItem("movieHistory"))
            myList.push(userSearchValue);
            var updatedHistory = JSON.stringify(myList);
            window.localStorage.setItem("movieHistory", updatedHistory);
            
            //Create a new button element and append it
            var newHistoryBtn = document.createElement('button');
            newHistoryBtn.className = "btn";
            newHistoryBtn.setAttribute("id", userSearchValue);
            newHistoryBtn.innerHTML = userSearchValue;
            searchHistoryButtons.appendChild(newHistoryBtn);
            searchHistoryCard.classList.remove("hidden");
        } 
        //Need to update this to be a modal instead of an alert but using that as a placeholder for now
    } else {
            //alert("Please enter a valid Movie title")
            errorMessage.innerHTML = "Please enter a valid Movie Title";
            openModal()
            return;
    }
    //Call the getMovieID function and reset the search text area to blank/clear Past Movie Info
    searchedMovieBody.innerHTML = "";
    getSearchedMovie(userSearchValue);
    //Reset the search input to blank
    userSearchInput.value = "";
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
            // console.log(response);
            var testMovieSearch = response.results;
            // console.log(testMovieSearch);
            //Checks to make sure there is a valid respons
            if (testMovieSearch.length === 0) {
                errorMessage.innerHTML = "No Movies found matching that title, please try a different Movie Title";
                openModal()
                return;
            };

                //create variables to store from the API response
                var movieId = response.results[0].id;
                var movieTitle = response.results[0].title;
                var movieDescrip = response.results[0].overview;
                var movieImg = response.results[0].poster_path;
                var releaseDate = dayjs(response.results[0].release_date).format("MM/DD/YYYY");

                //Update the movie Image
                searchedMovieImage.setAttribute("src", "https://image.tmdb.org/t/p/original" + movieImg);
                searchedMovieImage.setAttribute("alt", movieTitle)

                //Create an element to store the movie Title and append to the bodyUpdate the movie Title
                var searchedMovieTitle = document.createElement('h5');
                searchedMovieTitle.setAttribute("class", "card-title");
                searchedMovieTitle.setAttribute("id", "searchedMovieTitle");
                searchedMovieTitle.innerHTML = movieTitle;
                searchedMovieBody.appendChild(searchedMovieTitle);

                //Create an element to store the description and append to the body
                var newDescrip = document.createElement('p');
                newDescrip.innerHTML = "<strong>Description: </strong>" + movieDescrip;
                searchedMovieBody.appendChild(newDescrip);
                //Create an element to store the release date
                var release = document.createElement('p');
                release.innerHTML = "<strong>Release Date: </strong>" + releaseDate;
                searchedMovieBody.appendChild(release);
                //Unhide the searched movie card
                searchedMovieCard.classList.remove("hidden");
                //Return a fetch request to find similar movies using the movieID
                return fetch(tmdbGetRecommendationsUrl + movieId + "/recommendations?api_key=" + apiKey + "&language=en-US&page=1")
        })
        .then(function(response) {
            // return response in JSON format
            return response.json();
        })
        .then(function(response) {
            //console.log(response);
            displayRecommendations(response);
        })
};

function displayRecommendations(response) {
    //Delete existing recommendation elements if you had done a previous search
    var existingElCheck = document.querySelector('#recommendationCards');
    if (existingElCheck) {
        recommendationSection.innerHTML = "";
    };   

    //Tests to see if there are no recommendation results
    var testRecSearch = response.results;
    if (testRecSearch.length === 0) {
        var noRecsMessage = document.createElement('p');
        noRecsMessage.innerHTML = "Apologies we could not find any recommendations for this title";
        noRecs.appendChild(noRecsMessage);
    };

    //Tests to see if there are less than 5 recommendation results
    if (testRecSearch.length < 9) {
        newRecNumber = testRecSearch.length;
    } else {
        newRecNumber = 9
    }
    
    //Create a for loop to go through the array of recommendations
    for (i = 0; i < newRecNumber; i++) {
        //update variables
        var movieID = response.results[i].id;
        var movieTitle = response.results[i].title;
        var movieDescrip = response.results[i].overview;
        var movieImg = response.results[i].poster_path;
        var releaseDate = dayjs(response.results[i].release_date).format("MM/DD/YYYY");

        //Add a section element and give it the class card/id and append
        var newCard = document.createElement('section');
        newCard.setAttribute("class", "card col-3 p-1 m-1");
        newCard.setAttribute("id", "recommendationCards");
        recommendationSection.append(newCard);

        //Create an image element/attributes and add movie poster
        var recImg = document.createElement('img');
        recImg.setAttribute("class","card-img-top searchImages");
        recImg.setAttribute("alt", movieTitle);
        recImg.setAttribute("src", "https://image.tmdb.org/t/p/original" + movieImg);
        newCard.appendChild(recImg);
        
        //Create another section element for the card-body and append
        var recBody = document.createElement('section');
        recBody.setAttribute("class", "card-body");
        newCard.appendChild(recBody);

        //Create card title header and append to body
        var recTitle = document.createElement("h5")
        recTitle.setAttribute("class", "card-title");
        recTitle.innerHTML = movieTitle;
        recBody.appendChild(recTitle);

        //Create an element to store the description and append to the body
        var recDescrip = document.createElement('p');
        recDescrip.innerHTML = "<strong>Description: </strong>" + movieDescrip;
        recBody.appendChild(recDescrip);

        //Create an element to store the release date and append to the body
        var recRelease = document.createElement('p');
        recRelease.innerHTML = "<strong>Release Date: </strong>" + releaseDate;
        recBody.appendChild(recRelease);

        //Unhide the Recommendations Section
        recContainer.classList.remove("hidden");
    };
    
    getRatings();
};

//Fetch ratings details from OMDb Api
function getRatings() {
    //Get the searched title name
    var title = document.querySelector('#searchedMovieTitle').innerHTML;
    console.log(title);
    //Update the root URL to incorporate the API key and User Search Value
    var fetchUrl = omdbGetDetailsUrl + title;
    console.log(fetchUrl);
    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            //Create variables for genre, movie-rated, imdb rating, rotten tomatoes rating, and run time
            var genre = response.Genre;
            var rated = response.Rated;
            var rottenTomatoes = response.Ratings[1].Value;
            var imdb = response.imdbRating;
            var runTime = response.Runtime;
            // console.log(genre);
            // console.log(rated);
            // console.log(rottenTomatoes);
            // console.log(imdb);
            // console.log(runTime);

            //Create genre element
            var genreEl = document.createElement('p');
            genreEl.innerHTML = "<strong>Genre: </strong>" + genre;
            searchedMovieBody.appendChild(genreEl);

            //Create rated element
            var ratedEl = document.createElement('p');
            ratedEl.innerHTML = "<strong>Rated: </strong>" + rated;
            searchedMovieBody.appendChild(ratedEl);

            //Create run time element
            var runTimeEl = document.createElement('p');
            runTimeEl.innerHTML = "<strong>Run-Time: </strong>" + runTime;
            searchedMovieBody.appendChild(runTimeEl);

            //Create Rotten Tomatoes and IMDB element
            var rottenTomatoesIMDBEl = document.createElement('p');
            imgRTEl = "<img src='./assets/rottenTomatoesLogo.png' width='20' height='auto'>"
            imgIMDBEl = "<img src='./assets/imdbLogo.jpg' width='20' height='auto'>"
            rottenTomatoesIMDBEl.innerHTML = imgRTEl + " " + rottenTomatoes + "     " + imgIMDBEl + " " + imdb;
            searchedMovieBody.appendChild(rottenTomatoesIMDBEl);

        })
};


//Re-search a movie by hitting one of the search history buttons
var searchHistoryClickHandler = function(event) {
    var movieSearch = event.target.getAttribute("id");
    if (movieSearch) {
        //Clear Past Movie Info & Rerun Search
        searchedMovieBody.innerHTML = "";
        getSearchedMovie(movieSearch);
    };
};

//Function that opens the error Modal
function openModal() {
    document.querySelector(".modal").style.display = "block";
    document.querySelector(".modal").classList.add("show");
};

//Function that closes the error Modal
function closeModal() {
    document.querySelector(".modal").style.display = "none";
    document.querySelector(".modal").classList.remove("show");
}

//Event listener for when the user hits the search button
userSearchForm.addEventListener("submit", searchButtonHandler);

//Even listener for the modal close button
modalCloseBtn.addEventListener("click", closeModal);

//Event listener for if the user hits one of the search history buttons
searchHistoryButtons.addEventListener("click", searchHistoryClickHandler);

//Function that pulls existing search history from local storage if applicable
function loadHistory() {
    var listOfMovies = window.localStorage.getItem("movieHistory");
    if(listOfMovies) {
        var existingHistory = JSON.parse(listOfMovies);
        for (i = 0; i < existingHistory.length; i++) {
            var newBtn = document.createElement('button');
            newBtn.className = "btn";
            newBtn.setAttribute("id", existingHistory[i]);
            newBtn.innerHTML = existingHistory[i];
            searchHistoryButtons.appendChild(newBtn);
            searchHistoryCard.classList.remove("hidden");
        }
    }
};

//Call function that loads existing local storage if applicable
loadHistory();
