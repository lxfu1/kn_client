import React from 'react';
// import { hot } from 'react-hot-loader'
import {
    Route,
    Redirect,
    Switch,
    HashRouter as Router
} from 'react-router-dom';
import App from '../containers/App';
import { AsyncPage } from '../util/utils';
const Effect = AsyncPage(() => import('../containers/effect'));
const Progress = AsyncPage(() =>
    import('../containers/effect/subPage/canvasProgress')
);
const FireWork = AsyncPage(() =>
    import('../containers/effect/subPage/fireWork')
);
const Map = AsyncPage(() => import('../containers/effect/subPage/map'));
const Fire = AsyncPage(() => import('../containers/effect/subPage/fire'));
const Loading = AsyncPage(() => import('../containers/effect/subPage/loading'));
const FallStar = AsyncPage(() =>
    import('../containers/effect/subPage/fallStar')
);
const Panorama = AsyncPage(() =>
    import('../containers/effect/subPage/panorama')
);
const ArticleDetail = AsyncPage(() =>
    import('../containers/articles/subpage/detail')
);
const Blog = AsyncPage(() => import('../containers/blog'));
const Home = AsyncPage(() => import('../containers/Index'));
const Search = AsyncPage(() => import('../containers/search'));
const Hot = AsyncPage(() => import('../containers/hots'));
const Personal = AsyncPage(() => import('../containers/personal'));
const RecommendAuthor = AsyncPage(() =>
    import('../containers/recommendAuthor')
);
// 后台管理
const AdminSystem = AsyncPage(() => import('../containers/adminSystem/index'));
const ArticleManage = AsyncPage(() =>
    import('../containers/adminSystem/articleManage')
);
const ArticleEdit = AsyncPage(() =>
    import('../containers/adminSystem/articleManage/articleEdit')
);

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
                            <Route path="/main/effect/m" component={Map} />
                            <Route path="/main/effect/l" component={Loading} />
                            <Route path="/main/effect/fire" component={Fire} />
                            <Route
                                path="/main/effect/panorama"
                                component={Panorama}
                            />
                            <Route
                                path="/main/effect/fstar"
                                component={FallStar}
                            />
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
