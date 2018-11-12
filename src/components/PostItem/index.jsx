import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './index.scss'

// 列表超出点点点
const handleCut = content => {
  if (content.length > 140) {
    return `${content.substring(0, 140)}...`
  }
  return content
}

const PostItem = ({ data }) => {
  return (
    <figure className={styles.listItem}>
      <figcaption className={styles.itemCaption}>
        <Link
          to={data.url.url}
          title={data.title}
          target="_blank"
          className={styles.captionItem + ' ' + 'text-overflow'}
        >
          {data.title}
        </Link>

        {data.column === '联合奖惩政策' ? (
          <span className={styles.sourceBox}>
            <span className={styles.sourceTime}>{data.publishtime}</span>
          </span>
        ) : (
          <span className={styles.sourceBox}>
            <span className={styles.sourceIcon}>来源</span>
            <span
              title={data.source}
              className={styles.sourceItem + ' ' + 'text-overflow'}
            >
              {data.source}
            </span>
            <span className={styles.sourceTime}>{data.publishtime}</span>
          </span>
        )}
      </figcaption>
      <figcaption className={styles.itemContent}>
        <div className={styles.itemDIV}>{handleCut(data.content)}</div>
      </figcaption>
    </figure>
  )
}

PostItem.propTypes = {
  data: PropTypes.object.isRequired
}

export default PostItem
