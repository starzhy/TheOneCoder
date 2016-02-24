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
import Zhihu from './ios_view/Zhihu'
import Weixin from './ios_view/Weixin'
import Collection from './ios_view/Collection'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

StatusBarIOS.setStyle('default',false);

class TheOneCoder extends Component {
  constructor(){
    super();
    this.state = {
      tab:'zhihu'
    }
  }
  changeSelected(value){  
    this.setState({
      tab:value
    })
  }
  render() {
    return (
      <TabBarIOS style={styles.tabBarIOS} barTintColor="#f8f8f8" tintColor="#0D76E3" translucent={true}>
        <TabBarIOS.Item
          title="日报"
          onPress = {this.changeSelected.bind(this,'zhihu')}
          icon={require("image!home")}
          selected={this.state.tab==='zhihu'}>
            <NavigatorIOS
              barTintColor='#f8f8f8'
              tintColor='#666'
              titleTextColor="#333"
              style={{flex:1}} 
              initialRoute={{
                component:Zhihu,
                title:'知乎日报',
                navigationBarHidden:false,
                wrapperStyle:styles.tabwrapper,
                passProps:{}
            }} /> 
          </TabBarIOS.Item>
          <FontAwesome.TabBarItem
            title="微信热门"
            onPress = {this.changeSelected.bind(this,'weixin')}
            iconName="weixin"
            selectedIconName="weixin"
            iconSize = {26}
            selected={this.state.tab==='weixin'}>
              <NavigatorIOS
                barTintColor='#f8f8f8'
                tintColor='#666'
                titleTextColor="#333"
                style={{flex:1}} 
                initialRoute={{
                  component:Weixin,
                  title:'微信热门',
                  navigationBarHidden:false,
                  wrapperStyle:styles.tabwrapper,
                  passProps:{}
              }} /> 
          </FontAwesome.TabBarItem>
          <Icon.TabBarItem
            title="我的收藏"
            onPress = {this.changeSelected.bind(this,'collection')}
            iconName="ios-folder-outline"
            selectedIconName="ios-folder"
            iconSize = {28}
            selected={this.state.tab==='collection'}>
              <NavigatorIOS
                barTintColor='#f8f8f8'
                tintColor='#666'
                titleTextColor="#333"
                style={{flex:1}} 
                initialRoute={{
                  component:Collection,
                  title:'我的收藏',
                  navigationBarHidden:true,
                  passProps:{}
              }} /> 
          </Icon.TabBarItem>
        </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  tabwrapper:{
    marginTop:60
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
