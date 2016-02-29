/**
 * 
 * @authors ZHY
 * @date 2016-02-20
 */
import {
    React,
    Component,
    Text,
    AlertIOS,
    ActionSheetIOS
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as WechatAPI from 'react-native-wx';
import Storage from 'react-native-storage';
var storage = new Storage({
  //最大容量，默认值1000条数据循环存储
  size: 1000,    

  //数据过期时间，默认一整天（1000 * 3600 * 24秒）
  defaultExpires: 1000 * 3600 * 24 * 365,

  //读写时在内存中缓存数据。默认启用。
  enableCache: true,

  //如果storage中没有相应数据，或数据已过期，
  //则会调用相应的sync同步方法，无缝返回最新数据。
  sync : {
    //同步方法的具体说明会在后文提到
  }
});
global.storage = storage;  
var share = {
    show:function(data,articleSource,url,title,successCallback){
        var BUTTONS = [
          '微信朋友圈',
          '微信好友',
          '加入收藏',
          '取消',
        ];
        var cb = successCallback || function(){};
        ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: 3,
          destructiveButtonIndex: 3,
        },
        (buttonIndex) => {
            switch(buttonIndex){
              case 0:
                cb('分享到微信')
                WechatAPI.shareToTimeline(data);
                break;
              case 1:
                WechatAPI.shareToSession(data);
                break;
              case 2:
                var single = { 
                  from: articleSource,
                  url: url,
                  img:data.imageUrl,
                  title:title
                };
                storage.load({key:'article'}).then(ret =>{
                  var data = ret,
                      saved = false;

                  data.map((item) =>{
                    if(item.url==url){
                      saved = true;
                      return;
                    }
                  })
                  console.log(single.img)
                  if(saved){
                    cb('收藏成功');
                    return false;
                  }
                  data.unshift(single);
                  saveData(data);
                })
                .catch( err => {          
                  //没找到数据，第一次存储
                  var data = [];
                  data.push(single)
                  saveData(data)
                })

                break;

            }
            
      });
      function saveData(data){
        storage.save({
          key: 'article',
          rawData:data,
          expires:null
        });
        cb('收藏成功');
      }
    }
}
export default share;