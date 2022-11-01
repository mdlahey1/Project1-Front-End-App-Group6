var posterContainer = document.querySelector('#posters');
var titleSearch = 'Avengers'
var requestUrl = `https://api.themoviedb.org/3/search/movie?api_key=a6091da1f77938caf706363106cf0289&query=${titleSearch}&include_image_language`;
var ottKey = 'dcd790987emshccdebd291c2c399p165e18jsn1dcbb480c6f5';

var ottUrl = `https://ott-details.p.rapidapi.com/search?title=${titleSearch}&page=1`;

var genreObj = {};

function getGenre (url, i, title) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': ottKey,
            'X-RapidAPI-Host': 'ott-details.p.rapidapi.com'
        }
    };
    
    fetch(url, options)
        .then(response => response.json())
        .then(response => storeGenre(response.results, i, title))
        .catch(err => console.error(err));
    
}


function getApi(url) {
    fetch(url)
    .then(response => response.json())
    .then(response => displayPoster(response.results))
    .catch(err => console.error(err));
};

function getStreaming(url, i) {
    fetch(url)
    .then(response => response.json())
    .then(response => displayIcon(response.results, i))
    .catch(err => console.error(err));
};

function storeGenre (ottResults, i, title) {
    
    var genreObj = {};

    for (let i = 0; i < ottResults.length; i++) {

        var titleKey = ottResults[i].title;
        var genresArrayValue = ottResults[i].genre;
        
        genreObj[titleKey] = genresArrayValue;
    }

    displayGenre(genreObj, i, title);

}

function displayPoster(posterResults) {

    for (let i = 0; i < posterResults.length; i++){

        var movieTitle = posterResults[i].title;
        var imagePath = posterResults[i].poster_path;

        var card = document.createElement('div');
        var imageUrl = `https://image.tmdb.org/t/p/original${imagePath}`;
        var posterIcon = document.createElement('img');

        card.append(posterIcon);

        card.setAttribute('class', 'col');
        card.setAttribute('id', `col-${i}`)
        posterIcon.setAttribute('src', imageUrl);
        posterIcon.setAttribute('id', 'poster');

        

        // Also get the streaming icons

        var movieID = posterResults[i].id;
        var fetchProv = `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=a6091da1f77938caf706363106cf0289`;
        getStreaming(fetchProv, i);
        if (i == 0) {
            getGenre(ottUrl, i, movieTitle)
        }
        
        
        posterContainer.append(card);

    }

}

function displayIcon(flatRateResults, j) {

    var card = document.getElementById(`col-${j}`);

    try {

        var flatRates = flatRateResults.US.flatrate;

        for (let i = 0; i < flatRates.length; i++){

            var imagePath = flatRates[i].logo_path;

            
            var imageUrl = `https://image.tmdb.org/t/p/original${imagePath}`;
            var streamingIcon = document.createElement('img');

            card.append(streamingIcon);

            
            streamingIcon.setAttribute('src', imageUrl);
            streamingIcon.setAttribute('id', 'stream-icon');

            
        }
    } catch (err) {

        var noneAvailable = document.createElement('h6');
        noneAvailable.innerHTML = 'No streaming services available for this movie';
        card.append(noneAvailable)
    }

}

function displayGenre (obj, j, title) {

    var card = document.getElementById(`col-${j}`);

    try {

        var genreArray = obj[title]; 
        var genreDisplay = document.createElement('h5');
        genreDisplay.innerHTML = `Genres: ${genreArray}`

        card.append(genreDisplay);

    } catch(err) {

        var noneAvailable = document.createElement('h6');
        noneAvailable.innerHTML = 'Genre not available for this movie';
        card.append(noneAvailable)
    }
}

getApi(requestUrl);
