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
var recContainer = document.querySelector('#recContainer');
var recommendationSection = document.querySelector('#recommendationSection');
var errorMessage = document.querySelector('#errorMessage');
var modalCloseBtn = document.querySelector('#modalCloseBtn');
var localStorageArr = [];

//Create an event handler for when the user clicks the search button
var searchButtonHandler = function(event) {
    event.preventDefault();
    //Get the value of the users search
    var userSearchValue = userSearchInput.value.trim();
    console.log(userSearchValue);
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

            //Call the getMovieID function and reset the search text area to blank
            getSearchedMovie(userSearchValue);
            //Reset the search input to blank
            userSearchInput.value = "";
        } 
        //Need to update this to be a modal instead of an alert but using that as a placeholder for now
    } else {
            //alert("Please enter a valid Movie title")
            errorMessage.innerHTML = "Please enter a valid Movie Title";
            openModal()
            return;
    }
    //Call the getMovieID function and reset the search text area to blank
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
            console.log(response);
            //create variables to store from the API response
            var movieId = response.results[0].id;
            var movieTitle = response.results[0].title;
            var movieDescrip = response.results[0].overview;
            var movieImg = response.results[0].poster_path;
            var releaseDate = dayjs(response.results[0].release_date).format("MM/DD/YYYY");

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

    //Create a for loop to go through the array of recommendations
    for (i = 0; i < 5; i++) {
        //update variables
        var movieID = response.results[i].id;
        var movieTitle = response.results[i].title;
        var movieDescrip = response.results[i].overview;
        var movieImg = response.results[i].poster_path;
        var releaseDate = dayjs(response.results[i].release_date).format("MM/DD/YYYY");

        //Add a section element and give it the class card/id and append
        var newCard = document.createElement('section');
        newCard.setAttribute("class", "card col gih-100");
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
    }
};

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

//Research a movie by hitting one of the search history buttons
var searchHistoryClickHandler = function(event) {
    var movieSearch = event.target.getAttribute("id");
    if (movieSearch) {
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

//Call function that loads existing local storage if applicable
loadHistory();