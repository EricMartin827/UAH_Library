import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';

class NavList extends Component {
	renderList() {
		return this.props.navs.map((navs) => {
			return (
				<li
					key={navs.title}
					className="nav-list-group-item">
					<a href={navs.link}> {navs.title} </a>
				</li>
			);
		});
	}

	render() {
		return (
			<ul className="nav-list-group col-sm-4">
			    {this.renderList()}
			</ul>
		)
	}
}

function mapStateToProps(state) {
	// Whatever is returned will show up as props
	// inside of NavList
	return {
	    navs: state.navs
	};
}

// Promote NavList from a component to a container
export default connect(mapStateToProps)(NavList);
