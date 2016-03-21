import React,{
  Component,
  PixelRatio,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  Animated,
  View,
  Image,
  ActivityIndicatorIOS
} from 'react-native'

import Storage from 'react-native-storage';
var storage = new Storage({
  //最大容量，默认值1000条数据循环存储
  size: 1000,    

  //数据过期时间，默认一整天（1000 * 3600 * 24秒）
  defaultExpires: 1000 * 3600 * 24 * 365 * 30,

  //读写时在内存中缓存数据。默认启用。
  enableCache: true,

  //如果storage中没有相应数据，或数据已过期，
  //则会调用相应的sync同步方法，无缝返回最新数据。
  sync : {
    //同步方法的具体说明会在后文提到
  }
});
global.storage = storage;  


/*Loading*/
var loadingImage = Platform.OS == 'android' ? <Image source={require('../images/loading.gif')} width={24} height={24}/> : <ActivityIndicatorIOS size="small" color="#ccc"/>;
class Loading extends Component{
  render(){
    return (
      <View style={[styles.Loading]}>
        {loadingImage}<Text style={[styles.gray,styles.ml5]}>loading...</Text>
      </View>
    )
  }
}
/*LoadMoreTip*/
class LoadMoreTip extends Component{
  render(){
    return (
      <View style={[styles.LoadMoreTip]}>
        {loadingImage}<Text style={[styles.gray,styles.ml5,styles.transparent]}>加载中...</Text>
      </View>
    )
  }
}

/*LoadedAll*/
class LoadedAll extends Component{
  render(){
    return (
      <Text style={[styles.loadedAll,styles.gray]}>{this.props.text}</Text>
    )
  }
}

/*Tip*/
class Tip extends Component{
  constructor(props){
    super(props)
    this.state= {
      text:this.props.text,
      fadeAnim:new Animated.Value(0)
    }
  }
  componentDidMount() {
     Animated.timing(          // Uses easing functions
       this.state.fadeAnim,    // The value to drive
       {toValue: 1},           // Configuration
     ).start();                // Don't forget start!
  }
  render(){
    return (
      <View  style={[styles.TipModal]}>
        <Text style={[styles.textCenter,styles.TipText]}>{this.state.text}</Text>
      </View>

    )
  }
}

var width = Dimensions.get('window').width,
    height = Dimensions.get('window').height;
  console.log(width,height)
var until = {
  /*最小线宽*/
  pixel: 1 / PixelRatio.get(),
  /*屏幕尺寸*/
  size: {
    width: width,
    height:height
  },
  OS:Platform.OS,
  /**
   * 基于fetch的get方法
   * @method post
   * @param {string} url
   * @param {function} callback 请求成功回调
   */
  ajax:function(params){
    var url       = params.url,
        postData  = params.data,
        method    = params.method || 'get',
        headers   = params.headers,
        success   = params.success || function(){},
        failure   = params.failure || function(){};
    var opts = {
      method:method,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    };
    method=='post' ? opts.body=JSON.stringify(postData) : null;
    opts.headers = Object.assign(opts.headers,headers);

    fetch(url,opts)
      .then((response) => response.text())
      .then((responseText) => {
        success(JSON.parse(responseText));
      })
      .catch(function(err){
        failure(err);
      });
  },
  Loading:<Loading/>,
  LoadMoreTip:<LoadMoreTip />,
  LoadedAll:<LoadedAll text="你下面没了..."/>,
  pullHeaderRefresh:function(status){
    var txt ='下拉刷新';
    switch(status){
      case 0:
        txt ='下拉刷新';
      break;
      case 1:
        txt ='松手更新'
      break;
      case 2:
        txt ='加载中...'
      break;
      case 3:
        txt ='加载完成'
      break;
      default:
        txt ='';
      break;

    }
    if(status==2){
      return (
        <View style={[styles.ListviewHeader,styles.flex]}>
          <Image source={require('../images/loading.gif')} width={24} height={24}/>
          <Text style={[styles.ListviewLoading,styles.flex]}>{txt}</Text>
        </View>
      )
    }
    if(status==3){
      return (
        <View style={[styles.ListviewHeader,styles.flex]}>
          <Image source={require('../images/loading.gif')} width={24} height={24}/>
          <Text style={[styles.ListviewLoading,styles.flex]}>{txt}</Text>
        </View>
      )
    }
    return (
      <View style={[styles.ListviewHeader,styles.flex]}>
      <Image source={require('../images/loading.gif')} width={24} height={24}/>
        <Text style={[styles.ListviewLoading,styles.flex]}>{txt}</Text>
      </View>
    )
  },
  Tip:function(text){
    return <Tip text={text}/>
  }
};
const styles = StyleSheet.create({
  flex:{
    flex:1
  },
  width:{
    width:width
  },
  gray:{
    color:'#a8a8a8'
  },
  ml5:{
    marginLeft:5
  },
  transparent:{
    backgroundColor:'transparent'
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
    paddingBottom:10
  },
  loadedAll:{
    textAlign:'center',
    fontSize:13
  },
  textCenter:{
    textAlign:'center'
  },
  TipModal:{
    flex:1,
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
    height:until.size.height,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,.2)'
  },
  TipText:{
    paddingTop:20,
    paddingBottom:20,
    paddingLeft:20,
    paddingRight:20,
    borderRadius:5,
    color:'gray',
    marginBottom:130,
    backgroundColor:'#f8f8f8'
  },
  ListviewHeader:{
    justifyContent:'flex-end',
    alignItems:'center',
    // paddingTop:15
  },
  ListviewLoading:{
    fontSize:12,
    lineHeight:12,
    color:'#777',
    paddingBottom:5
  }
});
export default until;
