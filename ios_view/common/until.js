
import React,{
  Component,
  PixelRatio,
  Dimensions,
  StyleSheet,
  Text,
  ActivityIndicatorIOS,
  View
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
  get: function(url, successCallback, failCallback){
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        successCallback(JSON.parse(responseText));
      })
      .catch(function(err){
        failCallback(err);
      });
  },
  Loading:<Loading/>,
  LoadMoreTip:<LoadMoreTip />,
  LoadedAll:<LoadedAll text="你下面没了..."/>
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
    paddingBottom:52
  },
  loadedAll:{
    textAlign:'center',
    fontSize:13
  }
});
export default until;