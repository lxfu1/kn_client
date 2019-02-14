import React from 'react';
// import { hot } from 'react-hot-loader'
import {
    Route,
    Redirect,
    Switch,
    HashRouter as Router
} from 'react-router-dom';
import Effect from '../containers/effect';
import Progress from '../containers/effect/subPage/canvasProgress';
import FireWork from '../containers/effect/subPage/fireWork';
import ArticleDetail from '../containers/articles/subpage/detail';
import Blog from '../containers/blog';
import App from '../containers/App';
import Home from '../containers/Index';
import Search from '../containers/search';
import Hot from '../containers/hots';
import Personal from '../containers/personal';
import RecommendAuthor from '../containers/recommendAuthor';
// 后台管理
import AdminSystem from '../containers/adminSystem/index';
import ArticleManage from '../containers/adminSystem/articleManage';
import ArticleEdit from '../containers/adminSystem/articleManage/articleEdit';

const routes = () => (
    <Router>
        <Switch>
            <Route
                path="/"
                exact={true}
                render={() => <Redirect to="/main" />}
            />
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

                            {/* 空闲小写 */}
                            <Route
                                path="/main/effect"
                                exact
                                component={Effect}
                            />
                            <Route path="/main/effect/p" component={Progress} />
                            <Route path="/main/effect/f" component={FireWork} />
                            {/* 文章详情 */}
                            <Route
                                path="/main/detail/:articleId"
                                exact
                                component={ArticleDetail}
                            />

                            {/* 搜索 */}
                            <Route
                                path="/main/search/:keyword/:type"
                                component={Search}
                            />

                            {/* 个人中心 */}
                            <Route
                                path="/main/personal/:userId?"
                                component={Personal}
                            />

                            {/* 近日热度 */}
                            <Route path="/main/hot/:type" component={Hot} />

                            {/* blog */}
                            <Route path="/main/blog" component={Blog} />

                            {/* 推荐作者 */}
                            <Route
                                path="/main/rcAuthor"
                                component={RecommendAuthor}
                            />
                        </Switch>
                    </App>
                )}
            />
            {/* 后台管理 */}
            <Route
                path="/admin"
                component={props => (
                    <AdminSystem {...props}>
                        <Switch>
                            <Route
                                path="/admin"
                                exact={true}
                                render={() => <Redirect to="/admin/article" />}
                            />
                            <Route
                                path="/admin/article"
                                exact
                                component={ArticleManage}
                            />
                            <Route
                                path="/admin/article/edit/:id"
                                component={ArticleEdit}
                            />
                        </Switch>
                    </AdminSystem>
                )}
            />
        </Switch>
    </Router>
);

// export default hot(module)(routes)
export default routes;
