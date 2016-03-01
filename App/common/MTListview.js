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

var headerLoadingHeight = 50;
class MTListview extends Component{
  constructor(props){
    super(props);
    headerLoadingHeight = this.props.headerLoadingHeight;
    this.state = {
      loadingText:'下拉刷新',
      wrapPaddingTop:0,
      currentState:0   //0下拉刷新状态  1加载中状态  2加载完成状态
    }
  }

  handleScroll(e) {
    this.lastScrollY = scrollY
    this.lastContentInsetTop = e.nativeEvent.contentInset.top
    this.lastContentOffsetX = e.nativeEvent.contentOffset.x
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    if(scrollY>0) return;
    if(typeof this.preScrollY =='undefined'){
      this.preScrollY=10;
    }
    var isTouching = true,direction = this.preScrollY>scrollY ? 1 : -1; //1往下拉，-1回弹
    this.preScrollY = scrollY;
    console.log(Math.abs(scrollY))
    if(Math.abs(scrollY)<30) return;
    if(direction==1){
      if(this.props.isRefreshing) return;
      this.setState({
        loadingText:'松开刷新',
        currentState:0
      })
    }else{
      if(!this.props.isRefreshing && !this.state.currentState){  
        //刚松手 onRefresh是传进来的加载数据事件，并把props.isRefreshing设置为true
        this.props.onRefresh();
        this.setState({
          wrapPaddingTop:headerLoadingHeight,
          currentState:1,
          loadingText:'加载中...'
        });
      } 
      clearInterval(this.interval)
      this.interval = setInterval(()=>{
        if(!this.props.isRefreshing){
          this.setState({
            loadingText:'加载完成',
            currentState:2
          })
          clearInterval(this.interval);
          setTimeout(()=>{
            this.setState({
              wrapPaddingTop:0,
              loadingText:'下拉刷新',
              currentState:0
            })
          },300)
          this.interval = null;
        }
      },500)
    }
  }
  render(){
   return(
      <View style={{flex:1,paddingTop:this.state.wrapPaddingTop}}>
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
          style={[mt.Listview]}>
        </ListView>
      </View>
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
