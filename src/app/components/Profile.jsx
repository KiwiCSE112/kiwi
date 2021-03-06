import React, { Component } from 'react';
import { connect } from 'react-redux';

// - Import app components
import ProfileHead from './ProfileHead';
import Blog from './Blog';

// - Import actions
import * as postActions from '../actions/postActions';
import * as userActions from '../actions/userActions';
import * as globalActions from '../actions/globalActions';

export class Profile extends Component {

    componentWillMount = () => {
        this.props.loadPosts();
        this.props.loadUserInfo();
    }

    /**
     * Check if user should be able to view posts of this profile
     * That is, the profile must be of the own user or a friend.
     * @returns true if profile is own or a friend's, false otherwise
     */
    allowViewPosts = () => {
        let { friendList, userId, isAuthedUser } = this.props;
        let hasProfileAccess = isAuthedUser;
        Object.keys(friendList).forEach((index) => {
            if (friendList[index].uid === userId)
                hasProfileAccess = true;
        });
        return hasProfileAccess
    }
    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        if (this.allowViewPosts()){
            return (
                <div style={{ margin: '0 auto', width: '90%' }}>
                    <div>
                        <ProfileHead avatar={this.props.avatar} isAuthedUser={this.props.isAuthedUser} banner={this.props.banner} fullName={this.props.name} followerCount={0} userId={this.props.userId} />
                    </div>
                    {this.props.posts && Object.keys(this.props.posts).length !== 0 ?
                        (<div>
                            <div className='profile__title'>
                                {this.props.name}'s posts
                            </div>
                            <div style={{ height: '24px' }}></div>
                            <Blog posts={this.props.posts} displayWriting={false} adSky={false} adPost={false} />
                        </div>) 
                        : (<div className='profile__title'>
                            Nothing shared
                            </div>)
                    }
                </div>
            );
        }
        return (
            <div style={{ margin: '0 auto', width: '90%' }}>
                <div>
                    <ProfileHead avatar={this.props.avatar} isAuthedUser={this.props.isAuthedUser} banner={this.props.banner} fullName={this.props.name} followerCount={0} userId={this.props.userId} />
                </div>

                <div className='profile__title'>
                    You must be friends in order to view posts!
                </div>
            </div>
        );
    }
}


/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
    const { userId } = ownProps.match.params
    return {
        loadPosts: () => dispatch(postActions.dbGetPostsByUserId(userId)),
        loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId, 'header'))

    }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
    const { userId } = ownProps.match.params
    const { uid } = state.authorize
    return {
        avatar: state.user.info && state.user.info[userId] ? state.user.info[userId].avatar || '' : '',
        name: state.user.info && state.user.info[userId] ? state.user.info[userId].fullName || '' : '',
        banner: state.user.info && state.user.info[userId] ? state.user.info[userId].banner || '' : '',
        posts: state.post.userPosts ? state.post.userPosts[userId] : {},
        isAuthedUser: userId === uid,
        userId,
        friendList: state.friendList ? state.friendList : [],
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(Profile)