'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  AlertIOS,
  ListView,
  ScrollView,
  View,
  Platform,
  RefreshControl
} from 'react-native';

var headerLoadingHeight = 50,
    running = false,
    refreshable = true;
class MTListview extends Component{
  constructor (props){
    super(props);
    headerLoadingHeight = this.props.headerLoadingHeight;
    refreshable = this.props.refreshable;
    this.state = {
      currentState:0
    }

  }

  handleScroll (e){
    if(e.nativeEvent.contentOffset.y<= -10 && this.isTouching && !running && refreshable){
      this.setState({
        currentState:1
      });
      running = true;
    }
  }
  onResponderGrant() {
    this.isTouching = true;
  }
  onResponderRelease() {
    this.isTouching = false;
    if(this.state.currentState!=1) return;
    this._scrollResponder.scrollTo({y:0});
    this.setState({
      currentState : 2,
    });

    //加载完成回调
    this.props.onRefreshData(()=>{
      this.setState({
        currentState : 3,
      });
      this._scrollResponder.scrollTo({y:headerLoadingHeight});
      setTimeout(()=>{
        this.setState({
          currentState:0
        });
        running = false;
      },300);
    });

  }
  componentDidMount() {
    this._scrollResponder = this.refs.listview.getScrollResponder();
  }
   _calculateContentOffset() {
    if (refreshable && Platform.OS !== 'android') {
      return {y: headerLoadingHeight};
    } else {
      return {y: 0};
    }
  }
  _calculateContentInset(){
    if (refreshable&& Platform.OS !== 'android') {
      return {top:-headerLoadingHeight};
    } else {
      return {top:0};
    }
  }
  _refreshControl(){
    if(Platform.OS == 'android' && refreshable){
      return (
        <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh.bind(this)}
            tintColor="#000"
            title="Loading..."
            colors={['#cccccc']}
            progressBackgroundColor="#666"/>
      )
    }
    return;
  }

  onRefresh(){
    if(Platform.OS == 'android'){
      this.setState({
        isRefreshing:true
      })
    }
    this.props.onRefreshData(()=>{
      this.setState({
        isRefreshing:false
      })
    })
  }
  render (){
    return (
      <ListView
        ref="listview"
        automaticallyAdjustContentInsets={false}
        dataSource = {this.props.dataSource}
        renderRow = {this.props.renderRow}
        onEndReached = {this.props.onEndReached}
        onScroll = {this.handleScroll.bind(this)}
        onResponderRelease = {this.onResponderRelease.bind(this)}
        onResponderGrant = {this.onResponderGrant.bind(this)}
        renderHeader = {refreshable && Platform.OS !== 'android' ? this.props.renderHeader.bind(this,this.state.currentState):null}
        renderFooter = {this.props.renderFooter.bind(this)}
        scrollEventThrottle={200}
        contentInset={this._calculateContentInset()}
        contentOffset={this._calculateContentOffset()}
        refreshControl = {this._refreshControl()}
      >
      </ListView>
    )
  }
}

export default MTListview;
