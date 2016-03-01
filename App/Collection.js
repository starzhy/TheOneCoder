/**
 * 我的收藏
 * 数据读取来自AsyncStorage
 * @authors ZHY
 * @date 2016-02-23
 */
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
/*我的收藏*/
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class Collection extends Component{
  constructor(){
    super();
    this.data = [];
    this.state = {
      show:false,
      dataSource: ds.cloneWithRows(this.data),
      page:1,
      totalPage:50,
      isRefreshing:false
    }
  }
  componentDidMount(){
    this.getData();
  }
  getData(){
    var self = this;
    storage.load({key:'article'}).then(ret =>{
      self.setState({
        show:true,
        ajaxing:false,
        isRefreshing:false,
        dataSource: ds.cloneWithRows(ret)
      })
    })
    .catch( err => {          
        self.setState({
            show:false,
            isRefreshing:false
        })
    })
    
  }
  loadPage(url,title,imgUrl,from) {
    var that = this,
        source = from=='知乎' ? 'zhihu':'weixin';
    this.props.navigator.push({
      component:Detail,
      title:'',
      passProps:{
        url:url,
        source:source
      }
    })
  }

  renderRow(result,sid,rid) {
    var pic = result.img;
    return (
      <TouchableHighlight underlayColor="#eee" onPress={this.loadPage.bind(this,result.url,result.title,pic,result.from)}>
          <View style={[styles.ListItem,rid%2 ? styles.bgOdd:'']} ref={result.id}>
            <Image style={styles.listImage} source={{uri:pic}} resizeModle="cover"/>
            <Text numberOfLines={3} style={[styles.listTitle]}>{result.title}</Text>
            <Text style={[styles.listItemDate]}>来源：{result.from}</Text>
          </View>
      </TouchableHighlight>
    )
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
      <View style={[styles.flex,styles.indexList]}>
        <MTListview 
            dataSource={this.state.dataSource} 
            renderRow={this.renderRow.bind(this)}
            renderHeader = {(txt,currentState)=>{return until.pullHeaderRefresh(txt,currentState)}}
            headerLoadingHeight = {50}
            renderFooter = {this.renderFooter.bind(this)}
            isRefreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
            >
          </MTListview>
        {
          this.state.show ?  null: <Text style={[styles.noData,styles.gray]}>都不收藏，你下面没了...</Text>
        }
      </View>
    )
  }
}

 
/*文章详情页*/
class Detail extends Component{
  render(){
    var top = this.props.source=='zhihu' ? 0:50
    return (
      <WebView automaticallyAdjustContentInsets={false}
        style={styles.flex}
        contentInset={{top:top,bottom:47}}
        startInLoadingState={true}
        source={{uri:this.props.url}}/>
    )
  }
}


const styles = StyleSheet.create({

  bgOdd:{
    backgroundColor:'#f7f7f7'
  },

  center:{
    justifyContent:'center',
    alignItems:'flex-end'
  },
  indexList:{
    marginBottom:10
  },
  
  ListItem:{
    flex:1,
    flexDirection:'row',
    paddingTop:10,
    paddingBottom:10,
    borderBottomWidth:1/until.pixel,
    borderBottomColor:'#fff',
    
  },
  listImage:{
    width:60,
    height:60,
    marginLeft:5,
    justifyContent:'center',
    flex:1
  },
  listTitle:{
    fontSize:15,
    color:'#333',
    paddingLeft:5,
    paddingRight:5,
    lineHeight:20,
    flex:3
  },
  
  listItemDate:{
    textAlign:'center',
    fontSize:12,
    height:20,
    lineHeight:16,
    paddingLeft:4,
    paddingRight:4,
    backgroundColor:'#eee',
    color:'#999',
    position:'absolute',
    right:10,
    bottom:10
  },
  Detail:{
    backgroundColor:'red',
    flexDirection:'row'
  },

  webviewImage:{
    width:until.size.width,
    height:100
  },
  noData:{
    textAlign:'center',
    fontSize:13,
    position:'absolute',
    top:150,
    width:until.size.width
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
  ml5:{
    marginLeft:5
  },
  transparent:{
    backgroundColor:'transparent'
  }
});

export default Collection;