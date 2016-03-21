'use strict'

var React = require('react-native');

var {
  ListView,
  Platform,
  TouchableHighlight,
  View,
  Text,
  PullToRefreshViewAndroid
} = React;
import until from './until'

// small helper function which merged two objects into one
function MergeRecursive(obj1, obj2) {
  for (var p in obj2) {
    try {
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

var GiftedListView = React.createClass({

  getDefaultProps() {
    return {
      customStyles: {},
      firstLoader:true,
      initialListSize: 10,
      refreshable: true,
      refreshableViewHeight: 50,
      refreshableDistance: 40,
      headerView: null,
      sectionHeaderView: null,
      withSections: false,
      onFetch(callback, options) { callback([]); },

      refreshableFetchingView: null,
      refreshableWillRefreshView: null,
      refreshableWaitingView: null,
      emptyView: null,
      renderSeparator: null,
      PullToRefreshViewAndroidProps: {
        colors: ['#000000'],
        progressBackgroundColor: '#c8c7cc',
      },
    };
  },

  propTypes: {
    customStyles: React.PropTypes.object,
    initialListSize: React.PropTypes.number,
    refreshable: React.PropTypes.bool,
    refreshableViewHeight: React.PropTypes.number,
    refreshableDistance: React.PropTypes.number,
    headerView: React.PropTypes.func,
    sectionHeaderView: React.PropTypes.func,
    withSections: React.PropTypes.bool,
    onFetch: React.PropTypes.func,

    refreshableFetchingView: React.PropTypes.func,
    refreshableWillRefreshView: React.PropTypes.func,
    refreshableWaitingView: React.PropTypes.func,
    emptyView: React.PropTypes.func,
    renderSeparator: React.PropTypes.func,
    PullToRefreshViewAndroidProps: React.PropTypes.object,
  },

  _setY(y) { this._y = y; },
  _getY(y) { return this._y; },
  _setRows(rows) { this._rows = rows; },
  _getRows() { return this._rows; },

  headerView() {
    if ( !this.props.headerView){
      return null;
    }
    return this.props.headerView();
  },
  refreshableFetchingView() {
    if (this.props.refreshableFetchingView) {
      return this.props.refreshableFetchingView();
    }
    return (
      <View>
        <View style={[this.defaultStyles.refreshableView, this.props.customStyles.refreshableView]}>
          {until.Loading}
        </View>
        {this.headerView()}
      </View>
    );
  },
  refreshableWillRefreshView() {
    if (this.props.refreshableWillRefreshView) {
      return this.props.refreshableWillRefreshView();
    }

    return (
      <View>
        <View style={[this.defaultStyles.refreshableView, this.props.customStyles.refreshableView]}>
          <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
            ↻
          </Text>
        </View>
        {this.headerView()}
      </View>
    );
  },
  refreshableWaitingView(refreshCallback) {
    if (this.props.refreshableWaitingView) {
      return this.props.refreshableWaitingView(refreshCallback);
    }

    return (
      <View>
          <View style={[this.defaultStyles.refreshableView, this.props.customStyles.refreshableView]}>
            <Text style={[this.defaultStyles.actionsLabel, this.props.customStyles.actionsLabel]}>
              ↓
            </Text>
          </View>
        {this.headerView()}
      </View>
    );
  },
  emptyView(refreshCallback) {
    if (this.props.emptyView) {
      return this.props.emptyView(refreshCallback);
    }

    return (
      <View style={[this.defaultStyles.defaultView, this.props.customStyles.defaultView]}>
        <Text style={[this.defaultStyles.defaultViewTitle, this.props.customStyles.defaultViewTitle]}>
          Sorry, there is no content to display
        </Text>

        <TouchableHighlight
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
        >
          <Text>
            ↻
          </Text>
        </TouchableHighlight>
      </View>
    );
  },
  renderSeparator() {
    if (this.props.renderSeparator) {
      return this.props.renderSeparator();
    }

    return (
      <View style={[this.defaultStyles.separator, this.props.customStyles.separator]} />
    );
  },

  getInitialState() {

    if (this.props.refreshable === true && Platform.OS !== 'android') {
      this._setY(this.props.refreshableViewHeight);
    } else {
      this._setY(0);
    }
    this._setRows([]);

    var ds = null;
    if (this.props.withSections === true) {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
      });
      return {
        dataSource: ds.cloneWithRowsAndSections(this._getRows()),
        refreshStatus: 0,   //0 下拉等待  1 松手刷新  2 加载中  3加载完成
        isRefreshing: false
      };
    } else {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      return {
        dataSource: ds.cloneWithRows(this._getRows()),
        refreshStatus: 0,
        isRefreshing: false
      };
    }
  },

  componentDidMount() {
    this._scrollResponder = this.refs.listview.getScrollResponder();
  },

  setNativeProps(props) {
    this.refs.listview.setNativeProps(props);
  },

  _refresh() {
    this._onRefresh({external: true});
  },

  _onRefresh(options = {}) {
    if (this.isMounted()) {
      this._scrollResponder.scrollTo({y: 0});
      this.setState({
        refreshStatus: 2,
        isRefreshing: true,
      });
      this.props.onFetch(this._postRefresh, options);      
    }
  },

  _postRefresh() {
    if (this.isMounted()) {
      this.setState({
        refreshStatus:3,
        isRefreshing: false,
      });
      setTimeout(()=>{
          this.setState({
            refreshStatus:0
          });
      },100)
      if (this.props.refreshable === true && Platform.OS !== 'android') {
        // @issue
        // if a scrolling is already in progress, this scroll will not be executed
        this._scrollResponder.scrollTo({y: this.props.refreshableViewHeight});
      }
    }
  },



 
  _onResponderRelease() {
    console.log(this.state.refreshStatus)
    if (this.props.refreshable === true) {
      if (Platform.OS !== 'android') {
        if (this.state.refreshStatus === 1) {
          this._onRefresh();
        }
      }
    }
  },

  _onScroll(e) {
    this._setY(e.nativeEvent.contentOffset.y);
    if (this.props.refreshable === true) {
      if (Platform.OS !== 'android') {
        if (this._getY() < this.props.refreshableViewHeight - this.props.refreshableDistance
        && this.state.refreshStatus === 0
        && this._scrollResponder.scrollResponderHandleScrollShouldSetResponder() === true
      ) {
          this.setState({
            refreshStatus: 1,
            isRefreshing: false,
          });
        }
      }
    }
  },


  _calculateContentInset() {
    if (this.props.refreshable === true && Platform.OS !== 'android') {
      return {top: -1 * this.props.refreshableViewHeight, bottom: 0, left: 0, right: 0};
    } else {
      return {top: 0, bottom: 0, left: 0, right: 0};
    }
  },

  _calculateContentOffset() {
    if (this.props.refreshable === true && Platform.OS !== 'android') {
      return {x: 0, y: this.props.refreshableViewHeight};
    } else {
      return {x: 0, y: 0};
    }
  },


  renderListView(style = {}) {
    return (
      <ListView
        ref="listview"
        dataSource={this.props.dataSource}
        renderSectionHeader={this.props.sectionHeaderView}
        renderHeader={this.props.renderHeader.bind(this,this.state.refreshStatus)}
        renderRow={this.props.renderRow}
        renderFooter = {this.props.renderFooter}
        onScroll={this.props.refreshable === true && Platform.OS !== 'android' ? this._onScroll : null}
        onResponderRelease={this.props.refreshable === true && Platform.OS !== 'android' ? this._onResponderRelease : null}
        scrollEventThrottle={200}
        contentInset={this._calculateContentInset()}
        contentOffset={this._calculateContentOffset()}

        automaticallyAdjustContentInsets={false}
        scrollEnabled={true}
        canCancelContentTouches={true}

        onEndReached={this.props.onEndReached}/>
    );
  },

  render() {
    if (Platform.OS === 'android' && this.props.refreshable === true) {
      return (
        <PullToRefreshViewAndroid
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}

          {...this.props.PullToRefreshViewAndroidProps}

          style={[this.props.PullToRefreshViewAndroidProps.style, {flex: 1}]}
        >
          {this.renderListView({flex: 1})}
        </PullToRefreshViewAndroid>
      );
    } else {
      return this.renderListView();
    }
  },

  defaultStyles: {
    separator: {
      height: 1,
      backgroundColor: '#CCC'
    },
    refreshableView: {
      height: 50,
      backgroundColor: '#DDD',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionsLabel: {
      fontSize: 20,
    },
    paginationView: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
    },
    defaultView: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    defaultViewTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 15,
    },
  },
});


module.exports = GiftedListView;
