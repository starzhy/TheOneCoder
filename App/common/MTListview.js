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
    aniRate =0,
    running  =false;
class MTListview extends Component{
  constructor(props){
    super(props);
    headerLoadingHeight = this.props.headerLoadingHeight;
    this.state = {
      loadingText:'下拉刷新',
      translateY:-headerLoadingHeight,
      currentState:0   //0下拉刷新状态  1加载中状态  2加载完成状态
    }
  }
  componentWillReceiveProps(){
    if(this.props.isRefreshing){
      setTimeout(()=>{
        this.setState({
          loadingText:'加载完成',
          currentState:2
        })
      },200)
      this.lastScrollY =10;
      //setTimeout(()=>{animateTrans()},500)
      setTimeout(()=>{
        running = false;
        this.setState({
          loadingText:'下拉刷新',
          translateY:-headerLoadingHeight,
          currentState:0
        });
      },400)
    }
    //加载完成动画回弹
    // var self = this;
    // function animateTrans(){
    //   aniRate -=20;
    //   var loadingText = aniRate<-20 ? '下拉刷新':'加载完成'
    //   self.setState({
    //     loadingText:loadingText,
    //     translateY:aniRate,
    //     currentState:0
    //   });
    //   if(aniRate<=-headerLoadingHeight){
    //     aniRate=0;
    //     running = false;
    //   }else{
    //     window.requestAnimationFrame(animateTrans)
    //   } 
    // }
  }
  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    if(scrollY>0 || running) return;
    if(typeof this.lastScrollY =='undefined'){
      this.lastScrollY=10;
    }
    var direction = this.lastScrollY>scrollY ? 1 : -1; //1往下拉，-1回弹
    this.lastScrollY = scrollY;
    if(direction==1){
      if(!this.props.isRefreshing && (Math.abs(scrollY)+10<headerLoadingHeight) ) return;
      this.setState({
        translateY:-headerLoadingHeight-scrollY/2,
        loadingText:'松开刷新',
        currentState:1
      })
    }else{
      if(!this.state.currentState) return;
      running = true;
      this.props.onRefresh();
      this.setState({
        translateY:0,
        currentState:1,
        loadingText:'加载中...'
      });
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
        style={{transform:[{
            translateY:this.state.translateY
          }]
        }}>
      </ListView>
   )
  }
}
 

export default MTListview;
