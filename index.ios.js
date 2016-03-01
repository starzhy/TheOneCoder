/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  StatusBarIOS,
  TabBarIOS,
  NavigatorIOS,
  AlertIOS,
  View
} from 'react-native';
import Zhihu from './App/Zhihu'
import Weixin from './App/Weixin'
import Collection from './App/Collection'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

StatusBarIOS.setStyle('default',false);

class TheOneCoder extends Component {
  constructor(){
    super();
    this.state = {
      tab:'zhihu',
      tabItems:[
        {
          name:'日报',
          title:'知乎日报',
          type:'zhihu',
          component:Zhihu,
        },
        {
          name:'微信热门',
          title:'微信热门',
          type:'weixin',
          component:Weixin,
        },
        {
          name:'我的收藏',
          title:'我的收藏',
          type:'collection',
          component:Collection,
        }
      ]
    }
  }
  changeSelected(value){  
    this.setState({
      tab:value
    })
  }
  createNavigatorItem(index){
    return (
      <NavigatorIOS
        barTintColor='#f8f8f8'
        tintColor='#666'
        titleTextColor="#333"
        style={{flex:1}} 
        initialRoute={{
          component:this.state.tabItems[index].component,
          title:this.state.tabItems[index].title,
          wrapperStyle:styles.tabwrapper,
          navigationBarHidden:false,
          passProps:{}
      }} /> 
    )
  }
  render() {
    return (
      <TabBarIOS style={styles.tabBarIOS} barTintColor="#f8f8f8" tintColor="#0D76E3" translucent={true}>
          <TabBarIOS.Item
          title={this.state.tabItems[0].name}
          onPress = {this.changeSelected.bind(this,this.state.tabItems[0].type)}
          icon={require("image!home")}
          selected={this.state.tab==='zhihu'}>
            {
              this.createNavigatorItem(0)
            } 
          </TabBarIOS.Item>
          <FontAwesome.TabBarItem
            title={this.state.tabItems[1].name}
            onPress = {this.changeSelected.bind(this,this.state.tabItems[1].type)}
            iconName={this,this.state.tabItems[1].type}
            selectedIconName={this,this.state.tabItems[1].type}
            iconSize = {26}
            selected={this.state.tab==='weixin'}>
              {
                this.createNavigatorItem(1)
              } 
          </FontAwesome.TabBarItem>
          <Icon.TabBarItem
            title={this.state.tabItems[2].name}
            onPress = {this.changeSelected.bind(this,this.state.tabItems[2].type)}
            iconName="ios-folder-outline"
            selectedIconName="ios-folder"
            iconSize = {28}
            selected={this.state.tab==='collection'}>
              {
                this.createNavigatorItem(2)
              }
          </Icon.TabBarItem>
        </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  tabwrapper:{
    marginTop:65
  },
  flex:{
    flex:1
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

AppRegistry.registerComponent('TheOneCoder', () => TheOneCoder);
