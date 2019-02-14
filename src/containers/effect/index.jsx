import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FallCard } from './config';
import styles from './style.scss';

class Effect extends Component {
    render() {
        return (
            <div
                className={styles.container}
                style={{ height: FallCard.maxHeight + 'px' }}
            >
                {FallCard.data.map((item, index) => {
                    return (
                        <div
                            className={styles.common}
                            style={{ ...item.style }}
                            key={index}
                        >
                            <Link to={item.link || '#'}>
                                <div className={styles.card}>
                                    <img
                                        className={styles.img}
                                        src={item.src}
                                    />
                                    <h5
                                        style={{
                                            color: item.color || '#f69581'
                                        }}
                                    >
                                        {item.title}
                                    </h5>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Effect;
