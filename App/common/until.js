
import React,{
  Component,
  PixelRatio,
  Dimensions,
  StyleSheet,
  Text,
  Animated,
  Modal,
  ActivityIndicatorIOS,
  View,
  Image
} from 'react-native'

/*Loading*/
class Loading extends Component{
  render(){
    return (
      <View style={[styles.Loading]}>
        <ActivityIndicatorIOS size="small" color="#ccc"/><Text style={[styles.gray,styles.ml5]}>loading...</Text>
      </View>
    )
  }
}
/*LoadMoreTip*/
class LoadMoreTip extends Component{
  render(){
    return (
      <View style={[styles.LoadMoreTip]}>
        <ActivityIndicatorIOS size="small" color="#ccc" style={{marginTop:20}}/><Text style={[styles.gray,styles.ml5,styles.transparent]}>加载中...</Text>
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
var until = {
  /*最小线宽*/
  pixel: 1 / PixelRatio.get(),
  /*屏幕尺寸*/
  size: {
    width: width,
    height:height
  },
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
  pullHeaderRefresh:function(txt,currentState){
      return (
        <View style={[styles.ListviewHeader]}>
          <Image source={require("image!home")}/>
          <Text style={[styles.ListviewLoading]} ref="loadingText">{txt}</Text>
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
    height:50,
    justifyContent:'center',
    alignItems:'center'
  },
  ListviewLoading:{
    fontSize:12,
    lineHeight:16,
    color:'#777'
  }
});
export default until;