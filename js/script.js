var posterContainer = document.querySelector('#posters')
var requestUrl = 'https://api.themoviedb.org/3/search/movie?api_key=a6091da1f77938caf706363106cf0289&query=Avengers&include_image_language';
var ottKey = '62e4d11a06msh5de2a416a1456c1p1475fajsn6107c95aedbc';

var genreObj = {};

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

function displayPoster(posterResults) {

    for (let i = 0; i < posterResults.length; i++){

        var imagePath = posterResults[i].poster_path

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
        console.log(i);
        getStreaming(fetchProv, i);
        
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

getApi(requestUrl);
