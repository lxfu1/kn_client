import React from 'react'
// import { hot } from 'react-hot-loader'
import { Route, Redirect, Switch, HashRouter as Router } from 'react-router-dom'
import Article from '../containers/articles'
import ArticleDetail from '../containers/articles/subpage/detail'
import Blog from '../containers/blog'
import App from '../containers/App'
import Home from '../containers/Index'
import Search from '../containers/search'
import Hot from '../containers/hots'

const routes = () => (
  <Router>
    <Switch>
      <Route path="/" exact={true} render={() => <Redirect to="/main" />} />
      <Route
        path="/main"
        component={props => (
          <App {...props}>
            <Switch>
              {/* 首页 */}
              <Route
                path="/main"
                exact={true}
                render={props => <Redirect to="/main/home" />}
              />
              <Route path="/main/home" component={Home} />

              {/* 文章 */}
              <Route
                path="/main/article"
                exact
                component={Article}
              />
              {/*文章详情*/}
               <Route
                path="/main/detail/:articleId"
                exact
                component={ArticleDetail}
              />

              {/*搜索*/}
               <Route
                path="/main/search/:keyword/:type/:labelId?"
                component={Search}
              />

              {/*近日热度*/}
               <Route
                path="/main/hot/:type"
                component={Hot}
              />

              {/* blog */}
              <Route
                path="/main/blog"
                component={Blog}
              />
            </Switch>
          </App>
        )}
      />
    </Switch>
  </Router>
)

// export default hot(module)(routes)
export default routes
