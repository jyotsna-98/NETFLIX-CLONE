window.onload=()=>{
    getTopRatedMovies();
    getTrendingNow();
    getOriginals();
    getGenres();
}

fetchMovies=(url,element_selector,path_type)=>{
fetch(url)
 .then((response) => {
        if(response.ok){
         return response.json();
        }else{
            throw new Error("Something went wrong");
        }
     })
    .then((data)=>{
        showMovies(data,element_selector,path_type);
    })
    .catch((error_data)=>{
        console.log(error_data);
    })
  }
  //async await return a function as a promise
  
  async function getMovieTrailer(id){
      var urls=`https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`
    return await  fetch(urls)   
    .then((response) => {
        if(response.ok){
         return response.json();
        }else{
            throw new Error("Something went wrong");
        }
     })
    }

    // async function getMovieTrailer(id){
    
    //   // Promise.all() lets us coalesce multiple promises into a single super-promise
    //   return await Promise.all([
    //     fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`)
    //     .then((response) => {
    //     if(response.ok){
    //      return response.json();
    //     }else{
    //         throw new Error("Something went wrong");
    //     }
    //      }),// parse each response as json
    //     fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`)
    //    .then((response) => {
    //     if(response.ok){
    //      return response.json();
    //     }else{
    //         throw new Error("Something went wrong");
    //     }
    //      })
    //   ]);
      
    
     
    // } 
       
     
//////////////////////////////////////////////////////////////////////////////////////////////
  const setTrailer = (trailers,results) =>{
     const iframe=document.getElementById('movieTrailer');
      const modalTitle=document.querySelector('.modal-title')
     const movieNotFound=document.querySelector(".movieNotFound");
    if(trailers.length > 0){
         movieNotFound.classList.add('d-none'); //do not display the message
        iframe.classList.remove('d-none');      //show iframe
        iframe.src=`https://www.youtube.com/embed/${trailers[0].key}`
        modalTitle.innerHTML=results[0].name;
        
       
    }
    else{
        iframe.classList.add('d-none');     //display nothing in iframe
        movieNotFound.classList.remove('d-none'); //showing the message
    }
  }
  const handleMovieSelection =(e)=>{

      const id=e.target.getAttribute('data-id');
      const iframe=document.getElementById('movieTrailer');
     
      console.log(iframe);
      getMovieTrailer(id).then((data)=>{
        const results=data.results; //return array of results
         //console.log(results);
        const youTubeTrailers=results.filter((result)=>{
          if(result.site=="YouTube" && result.type=="Trailer"){
              return true;
          } 
          else{
              return false;
          }
        })
        setTrailer(youTubeTrailers,results);
      });
      $('#trailerModal').modal('show')
            }
    
  
    

  showMovies=(movies,element_selector,path_type)=>{
   var moviesEl=document.querySelector(element_selector);
      for(var movie of movies.results){
          var imageElement=document.createElement('img');
          imageElement.setAttribute('data-id',movie.id);
          imageElement.src=`https://image.tmdb.org/t/p/original${movie[path_type]}`;
          imageElement.addEventListener('click',(e)=>{
              handleMovieSelection(e);
          },false);               
           moviesEl.appendChild(imageElement);
            }
        }
getOriginals=()=>{
    let url="https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213"
    fetchMovies(url,".original__movies","poster_path");
   
}

getTrendingNow=()=>{
   let url="https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045"
    fetchMovies(url,"#trending","backdrop_path");
   }

getTopRatedMovies=()=>{
    let url="https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1"
    fetchMovies(url,"#topRated","backdrop_path");
  
}



//Loop through list of genres
//show genres in html
//fetch movies based on genres
//display the list of movies

//https://api.themoviedb.org/3/discover/movie?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28
//loop through each genre and called out all movies from fetchMovieBasedOnGenre. As we loop through each genre we pass the genreid and movies are fetched acc to genreid
function showMoviesGenres(genres){
//loop through genres 
    genres.genres.forEach(function(genre){
        var movies = fetchMoviesBasedOnGenre(genre.id)
        movies.then(function(movies){
           showMovieBasedOnGenre(genre.name,movies);
        }).catch(function(error){
            console.log(error);
        })

})
}
showMovieBasedOnGenre=(genreName,movies)=>{
let allMovies=document.querySelector('.movies');
let genreEl=document.createElement('div');
genreEl.classList.add('movies__header')
genreEl.innerHTML=`<h2>${genreName}</h2>`
  var moviesEl=document.createElement('div');
  moviesEl.classList.add('movies__container');
  moviesEl.setAttribute('id',genreName)
        
      for(var movie of movies.results){
          var imageElement=document.createElement('img');
          imageElement.setAttribute('data-id',movie.id);
          imageElement.src=`https://image.tmdb.org/t/p/original${movie["backdrop_path"]}`;
          imageElement.addEventListener('click',(e)=>{
              handleMovieSelection(e);
          },false);   

           moviesEl.appendChild(imageElement);
            }
             allMovies.appendChild(genreEl);
              allMovies.appendChild(moviesEl);
}
//another api call to fetch all movies by using promise 
 function fetchMoviesBasedOnGenre(genreId){
    let url="https://api.themoviedb.org/3/discover/movie";
    url += "?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
    url+=`&with_genres=${genreId}`
    return fetch(url)
 .then((response) => {
        if(response.ok){
         return response.json();
        }else{
            throw new Error("Something went wrong");
        }
     })
   
}
//Only genres is fetched 
getGenres=()=>{
    var url="https://api.themoviedb.org/3/genre/movie/list?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US";
    fetch(url)
 .then((response) => {
        if(response.ok){
         return response.json();
        }else{
            throw new Error("Something went wrong");
        }
     })
    .then((data)=>{
      showMoviesGenres(data);
    })
    .catch((error_data)=>{
        console.log(error_data);
    })
}