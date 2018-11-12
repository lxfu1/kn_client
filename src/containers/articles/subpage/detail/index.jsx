// zhouke 2017/12/15  信用动态
import React, { Component } from 'react'
import moment from 'moment'
import resource from 'util/resource'
import styles from './styles.scss'

class articleDetail extends Component {
    constructor(props){
        super(props);
        console.log(this.props);
        this.id = this.props.match.params.articleId;
        this.state = {
            data: {}
        }
    }

    componentDidMount(){
        this.getDetail(this.id);
    }

    getDetail = (articleId) => {
        resource.get(`/kn/getArticleDetail/${articleId}`).then(res => {
            if(res.status === 200){
                this.setState({
                    data: res.data
                })
            }
        }).catch(err => {
            message.error('程序出了点问题，客官请稍后访问');
            console.log(err);
        })
    }

    render() {
        const {data} = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.innner}>
                    <div className={styles.articleHeader}>
                        <h5>{data.title}</h5>
                    </div>
                    <div className={styles.author}>
                        <span>{moment(data.updateTime).format('YYYY-MM-DD hh:mm:ss')}</span>
                    </div>
                    <article dangerouslySetInnerHTML ={{__html: data.detail}}></article>
                </div>
            </div>
        )
    }
}

export default articleDetail
