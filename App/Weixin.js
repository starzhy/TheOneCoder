/*微信热门文章*/
'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  WebView,
  Image,
  ListView,
  RefreshControl,
  ActivityIndicatorIOS
} from 'react-native';
import until from './common/until'
import share from './common/share'
import MTListview from './common/MTListview.js'

/*Weixin精选*/
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class Weixin extends Component{
  constructor(){
    super();
    this.data = [];
    this.state = {
      show:false,
      dataSource: ds.cloneWithRows(this.data),
      page:1,
      totalPage:50,
      isRefreshing:false,
      tipText:'',
      tipShow:false,
    }
  }
  componentDidMount(){
    this.getData();
  }
  getData(){

    var news = [];
    until.ajax({
      url:'http://apis.baidu.com/txapi/weixin/wxhot?num=20&page='+this.state.page,
      headers:{
        'apikey':'f589f2834aeab120eef2e750e4fb1dfb'
      },
      success:(data)=>{
          this.data = this.data.concat(data.newslist);
          this.setState({
            show:true,
            ajaxing:false,
            isRefreshing:false,
            dataSource: ds.cloneWithRows(this.data)
          })
      },
      failure:(data)=>{}
    })
    
  }
  loadPage(url,title,imgUrl,flag) {
    var self = this;

    var data = {
      component:Detail,
      title:'',
      rightButtonTitle:'分享',
      passProps:{
        url:url,
        tipText:this.state.tipText,
        tipShow:this.state.tipShow
      },
      onRightButtonPress:function(){
        share.show({
          type:'news',
          title:title,
          description:'来自那个码农的资讯APP',
          imageUrl:imgUrl,
          webpageUrl:url,
        },'微信',url,title,(txt)=>{
              self.setState({
                tipText:txt,
                tipShow:true
              });
              self.loadPage(url,title,imgUrl,true);
              setTimeout(()=>{
                self.setState({
                  tipText:txt,
                  tipShow:false
                });
                self.loadPage(url,title,imgUrl,true);
              },1000)
        });
      }
    }
    flag ? this.props.navigator.replace(data):this.props.navigator.push(data)
  }

  renderRow(result) {
    var pic = result.picUrl || 'https://placeholdit.imgix.net/~text?txtsize=40&txt=%E5%9B%BE%E7%89%87%E8%A2%AB%E7%A8%8B%E5%BA%8F%E5%91%98%E5%90%83%E4%BA%86...&w=640&h=350';
    return (
      <View style={[styles.ListItem]}>
        <TouchableHighlight underlayColor="#eee" onPress={this.loadPage.bind(this,result.url,result.title,pic,false)}   style={[styles.ListItemTouchLabel]} >
          <Image style={styles.listImage} source={{uri:pic}} resizeModle="cover"/>
        </TouchableHighlight>
        <View>
          <View style={[styles.listTitleBg,styles.width]}></View>
          <Text numberOfLines={1} style={[styles.listTitle]}>{result.title}</Text>
        </View>
      </View>
    )
  }

  nextPage(){
    if(this.state.ajaxing) return;
    if(this.state.page>=this.state.totalPage){
      this.setState({
        loadedAll:true
      });
    }else{
      this.state.page++;
      this.setState({
        ajaxing:true
      })

      this.getData();
    }
  }

  _onRefresh(){
    this.data = [];
    this.setState({
      page:1,
      isRefreshing:true,
      loadedAll:false
    })
    this.getData();
  }

  renderFooter(data){
    if(this.state.loadedAll){
      return <Text style={[styles.loadedAll,styles.gray]}>你下面没了...</Text>
    }
    if(this.state.ajaxing){
      return until.LoadMoreTip
    }
    
  }

  render(){ 
    return (
      <View style={[styles.flex]}>
        {
          this.state.show ? <MTListview 
            dataSource={this.state.dataSource} 
            renderRow={this.renderRow.bind(this)}
            renderHeader = {(txt,currentState)=>{return until.pullHeaderRefresh(txt,currentState)}}
            headerLoadingHeight = {50}
            renderFooter = {this.renderFooter.bind(this)}
            isRefreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
            onEndReached={this.nextPage.bind(this)}
            >
          </MTListview> : until.Loading
        }
      </View>
    )
  }
}

 
/*文章详情页*/
class Detail extends Component{
  render(){
    return (
      
      <ScrollView style={[styles.webviewWrap]}>
        <WebView automaticallyAdjustContentInsets={false}
          style={styles.articleWebview}
          contentInset={{top:0,bottom:47}}
          startInLoadingState={true}
          source={{uri:this.props.url}}/>
        {this.props.tipShow ? until.Tip(this.props.tipText):null}
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  center:{
    justifyContent:'center',
    alignItems:'flex-end'
  },
  center:{
    justifyContent:'center',
    alignItems:'flex-end'
  },
  ListItem: {
    paddingBottom:20
  },
  flex:{
    flex:1
  },
  ListItemTouchLabel:{
    paddingBottom:2,
  },
  listTitleBg:{
    position:'absolute',
    top:-32,
    height:30,
    backgroundColor:'#eee',
    opacity:0.9
  },
  listTitle:{
    fontSize:13,
    color:'#333',
    paddingLeft:5,
    paddingRight:5,
    paddingBottom:10,
    lineHeight:20,
    marginTop:-30,
    backgroundColor:'transparent'
  },
  listImage:{
    width:until.size.width,
    height:160,
    justifyContent:'center'
  },
  loadedAll:{
    textAlign:'center',
    fontSize:13
  },
  Detail:{
    backgroundColor:'red',
    flexDirection:'row'
  },


  loadedAll:{
    textAlign:'center',
    fontSize:13
  },
  Loading:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop:30
  },
  LoadMoreTip:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'flex-end',
    marginTop:-10,
    paddingBottom:52
  },
  flex:{
    flex:1
  },
  width:{
    width:until.size.width
  },
  gray:{
    color:'#a8a8a8'
  },
  webviewWrap:{
    flex:1,
    height:until.size.height
  },
  articleWebview:{
    height:until.size.height
  },
  ml5:{
    marginLeft:5
  },
  transparent:{
    backgroundColor:'transparent'
  }
});

export default Weixin;