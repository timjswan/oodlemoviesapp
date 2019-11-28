import React, { Component } from 'react';

class ScrollToTop extends Component {
	constructor(props){
		super(props);

		this.state = {
			interval: 0
		}
	}

	step = () => {
		if(window.pageYOffset === 0)
			clearInterval(this.state.interval);

		window.scroll(0, window.pageYOffset - this.props.step);
	};

	scroll = () => {
		let interval = setInterval(this.step, this.props.delay);
		this.setState({ interval: interval });
	};

	render() {
		return (
			<a href="#" onClick={this.scroll} className="backtotop"><img src="img/backtotop.png" alt="Back to the top." /></a>
		);
	}
}

export default ScrollToTop;