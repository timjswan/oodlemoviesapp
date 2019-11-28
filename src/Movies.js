import React, { Component } from 'react';
import Movie from './Movie';
import ScrollToTop from './ScrollToTop';
import Button from 'react-bootstrap/Button';
import './Movies.css';
import './responsive.css';

const amountOfResultsToShow = 5;
const API_KEY = "46bf9061dbc8509809a8f910148bfc8f";

class Movies extends Component {
	constructor(props){
		super(props);

		this.state = {
			page: 1,
			pages: 0,
			resultsVisible: amountOfResultsToShow,
			loadedMoreMovies: false,
			hideLoadmore: false,
			dataError: false,
			movies: []
		}

		this.baseState = {
			...this.state,
			reset: true
		}
	}

	/* Called when Movies first loads. */
	componentDidMount() {
		this.getDataFromTmDb();
	}

	/* Each time the state of Movies is changed we need to handle 
		1: whether we have reached the last page in the dataset
		2: whether we have reached the end of the current page in the dataset */
	componentDidUpdate(prevProps, prevState){
		const moviesLength = this.state.movies.length;

		// if we haven't reset and tmdb response is 200 then we can continue otherwise infinite loop
		if(!this.state.reset && !this.state.dataError){
			/* last page if the amount of movies in state is different continue otherwise infinite loop
				then reset */
			if(this.state.loadedMoreMovies 
				&& moviesLength <= 0 
				&& moviesLength !== prevState.movies.length){
				this.setState({
					hideLoadmore: true
				});
			}

			// change current page only if we haven't reached the last page otherwise infinite loop
			if(this.state.resultsVisible > moviesLength && !this.state.hideLoadmore){
	  			this.setState(prevState => { 
		  			return { 
		  				page: prevState.page + 1,
		  				resultsVisible: amountOfResultsToShow
		  			}
	  			}, () => {
	  				// Use setState callback otherwise we will load the data before the state.page has changed
	  				this.getDataFromTmDb();
	  			}); 			
	  		}
  		}
	}

	/* Get our movie data from the movie db.
		Set the state of the component so that it shows the data */
	getDataFromTmDb = (reset) => {
		const url = "https://api.themoviedb.org/3/movie/top_rated" 
					+ "?api_key=" + API_KEY
					+ "&language=en-US&page=" + this.state.page;

		fetch(url)
		.then((data) => {
			if(!data.ok){
				return data.text().then(result => Promise.reject(new Error(result)));				
			}

			return data.json();
		})
		.then((res) => {			
			this.setState({
				pages: res.total_pages,
				movies: res.results,
				reset: (reset && reset !== undefined) && false
			});
		})
		.catch((err) => {
			this.setState({
				dataError: true
			});
			console.log(err);
		});
  	};

  	/* When the user clicks 'load...'.
  		Keep expanding the movies that are visble 
  		by the amount we should display each time until we reach the next page */
  	showMoreMovies = () => {
  		this.setState(prevState => { 
  			return { 
  				resultsVisible: prevState.resultsVisible + amountOfResultsToShow,
  				loadedMoreMovies: true
  			}
  		});	
  	};

  	reset = () => {
  		this.setState(this.baseState, () => {
  			this.getDataFromTmDb(true);
  		});
  	};

	render(){
		const { movies, resultsVisible, hideLoadmore, dataError } = this.state,
				moviesSegment = movies.slice(0, resultsVisible);
		
		/* Loop through each movie and send the data to a Movie component 
			Show and hide controls based on what stage we're at */
		return (
			<React.Fragment>
			<div className="title">
				{!hideLoadmore && !dataError && <h3>Page {this.state.page} of {this.state.pages}</h3>}
			</div>
			 <div className="movies-container">
				
				{movies.length <= 0
					? <p>No movies to display.</p>
					: moviesSegment.map(movie => (
			  		<Movie key={movie.id} movieData={{"movie" : movie}} />
				))}			
				
			</div>
			<div className="movies-container-footer">
				{!hideLoadmore && !dataError && <Button onClick={this.showMoreMovies}>Load more movies</Button>}
				{hideLoadmore && !dataError && <Button onClick={this.reset}>Reload</Button>}
					
				<ScrollToTop step="50" delay="16.6" />
			</div>
			</React.Fragment>
		);
	}
}

export default Movies;