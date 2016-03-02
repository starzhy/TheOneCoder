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

var headerLoadingHeight = -50,
    aniValue =0,
    running  =false;
class MTListview extends Component{
  constructor(props){
    super(props);
    headerLoadingHeight = -this.props.headerLoadingHeight;
    this.state = {
      loadingText:'下拉刷新',
      wrapPaddingTop:headerLoadingHeight,
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
      },300)
      this.preScrollY =10;
      setTimeout(()=>{animateTrans()},500)
    }
    //加载完成动画回弹
    var self = this;
    function animateTrans(){
      aniValue -=20;
      var loadingText = aniValue<-20 ? '下拉刷新':'加载完成'
      self.setState({
        loadingText:loadingText,
        wrapPaddingTop:aniValue,
        currentState:0
      });
      if(aniValue<=headerLoadingHeight){
        aniValue=0;
        running = false;
      }else{
        window.requestAnimationFrame(animateTrans)
      }
      
    }
  }
  handleScroll(e) {
    this.lastScrollY = scrollY
    this.lastContentInsetTop = e.nativeEvent.contentInset.top
    this.lastContentOffsetX = e.nativeEvent.contentOffset.x
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    if(scrollY>0 || running) return;
    if(typeof this.preScrollY =='undefined'){
      this.preScrollY=10;
    }
    var direction = this.preScrollY>scrollY ? 1 : -1; //1往下拉，-1回弹
    this.preScrollY = scrollY;
    if(direction==1){
      if(!this.props.isRefreshing && (Math.abs(scrollY)+10<Math.abs(headerLoadingHeight)) ) return;
      this.setState({
        wrapPaddingTop:headerLoadingHeight-scrollY/2,
        loadingText:'松开刷新',
        currentState:1
      })
    }else{
      //if(!this.state.currentState) return;
      console.log(this.props.isRefreshing)
      running = true;
      this.props.onRefresh();
      this.setState({
        wrapPaddingTop:0,
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
            translateY:this.state.wrapPaddingTop
          }]
        }}>
      </ListView>
   )
  }
}

const mt = StyleSheet.create({
  Listview:{
    transform:[{
      translateY:-headerLoadingHeight
    }]
  },
  flex:1
})

export default MTListview;
