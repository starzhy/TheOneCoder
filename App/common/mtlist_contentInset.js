/**
 * 
 * @authors ZHY
 * @date    2016-02-29 15:44:59
 * @version v1.0
 */
'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} from 'react-native';

var headerLoadingHeight = 50,
    aniValue =0,
    running  =false;
class MTListview extends Component{
  constructor(props){
    super(props);
    headerLoadingHeight = this.props.headerLoadingHeight;
    this.state = {
      loadingText:'下拉刷新',
      y:headerLoadingHeight,
      top:-headerLoadingHeight,
      currentState:0,   //0下拉刷新状态  1加载中状态  2加载完成状态
    }
  }
  componentWillReceiveProps(){
    //此时的props还是未更新的 will
    if(this.props.isRefreshing){ 
      this.setState({
        loadingText:'加载完成',
        currentState:2,
      })
      clearTimeout(this.timeHandle)
      this.timeHandle = setTimeout(()=>{
        
        running = false;
        this.lastScrollY = 10;
        this.setState({
          loadingText:'下拉刷新',
          currentState:0,
          y:headerLoadingHeight,
          top:-headerLoadingHeight
        });
      },200)
    }
  }
  handleScroll(e) {
    // this.lastContentInsetTop = e.nativeEvent.contentInset.top
    // this.lastContentOffsetX = e.nativeEvent.contentOffset.x
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    if( running || scrollY>0) return;
    var direction = (this.lastScrollY>scrollY || typeof this.lastScrollY=='undefined') ? 1 : -1; //1往下拉，-1回弹
    this.lastScrollY = scrollY;
    if(direction==1){
      if(Math.abs(scrollY)<headerLoadingHeight) return;
      this.setState({
        loadingText:'松开刷新',
        currentState:1
      })
    }else{
      if(!this.state.currentState) return;
      running = true;
      this.setState({
        loadingText:'加载中',
        currentState:1,
        y:0,
        top:0
      });
      //外边改变父级props.isRefreshing
      setTimeout(()=>{
        this.props.onRefresh();
      },300)
    }
  }
  render(){
   return(
      <ListView 
        dataSource={this.props.dataSource}
        automaticallyAdjustContentInsets={false}
        renderRow={this.props.renderRow}
        renderFooter = {this.props.renderFooter}
        renderHeader = {this.props.renderHeader.bind(this,this.state.loadingText,this.state.currentState)}
        initialListSize={10}
        onScroll={this.handleScroll.bind(this)}
        isRefreshing={this.props.isRefreshing}
        onEndReachedThreshold={100}
        onEndReached={this.props.onEndReached}
        ref="listView"
        contentInset={{
          top:this.state.top
        }}
        contentOffset={{
          y:this.state.y
        }}
        >
      </ListView>
   )
  }
}

export default MTListview;
