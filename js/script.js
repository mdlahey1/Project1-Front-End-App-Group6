var requestUrl1 = 'https://api.themoviedb.org/3/search/movie?api_key=a6091da1f77938caf706363106cf0289&query=Jaws&include_image_language';

function getApi(url) {
    fetch(url)
    .then(response => response.json())
    .then(response => console.log(response.results[0].poster_path))
    // .then(response => console.log(response))
    .catch(err => console.error(err));
};

// getApi(requestUrl);
getApi(requestUrl1)
