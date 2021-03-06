import React, { Component } from 'react';
import { LOCATIONS, IMAGE_URLS, Keys } from './sub/constants';
import style from './style.scss';
import { message } from 'antd';
import { Promise } from 'es6-promise';

message.config({
    top: 80
});
export default class Earth extends Component {
    constructor(props) {
        super(props);
        this.active = true;
        this.renderer = null;
        this.canvas = null;
        this.camera = null;
        this.scene = null;
        this.group = null;
        this.light = null;
        this.width = 0;
        this.height = 0;
        this.clickList = [];
        this.event = null;
        this.points = Keys;
    }

    componentDidMount() {
        if (document.querySelector('.three')) {
            this.initMap();
        } else {
            this.loadScript('/thr/three.js').then(res => {
                this.loadScript('/thr/event.js').then(r => {
                    this.initMap();
                });
            });
        }
    }

    initMap = () => {
        this.initDom(Keys);
        window.onresize = () => {
            document.querySelector('#canvas-frame').innerHTML = '';
            this.initDom(this.points);
        };
    };

    loadScript = src => {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = src;
            script.className = 'three';
            document.body.appendChild(script);
            script.onload = () => {
                resolve();
            };
        });
    };

    componentWillReceiveProps(nextProps) {
        // if (
        //     nextProps.words.length &&
        //     JSON.stringify(nextProps.words) !== JSON.stringify(this.props.words)
        // ) {
        //     this.clearDom();
        //     this.points = deepCopy(nextProps.words);
        //     this.initCloud(nextProps.words);
        // }
    }

    clearDom = () => {
        if (this.event) {
            this.event.removeAll();
        }
        if (this.clickList.length) {
            this.clickList.map(item => {
                item.off('click');
            });
        }
    };

    initDom = data => {
        this.initCanvas();
        this.initRenderer();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initEarth();
        this.initCloud(data);
        this.animate();
    };

    initCanvas = () => {
        let canvas;
        let ctx;
        let width = 2048;
        let height = 512;

        canvas = document.createElement('canvas');
        canvas.id = 'cvs';
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.fillStyle = '#212b4d';
        ctx.rect(0, 0, width, height);
        ctx.fill();

        this.canvas = canvas;
    };

    initRenderer = () => {
        let renderer;

        this.width = document.getElementById('canvas-frame').offsetWidth;
        this.height = document.getElementById('canvas-frame').clientHeight;
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        // renderer.setPixelRatio( window.devicePixelRatio);
        renderer.setSize(this.width, this.height);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);
        renderer.setClearColor(0x071732, 0);
        this.renderer = renderer;
    };

    initCamera = () => {
        let camera;

        camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 400;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 0;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });

        this.camera = camera;
    };

    initScene = () => {
        this.scene = new THREE.Scene();
        this.group = new THREE.Group();
        this.scene.add(this.group);
    };

    initLight = () => {
        let light;

        light = new THREE.PointLight(0x252f56, 1, 500);
        light.position.set(100, 100, 200);
        this.scene.add(light);

        this.light = light;
    };

    initEarth = () => {
        let texture, geometry, material, mesh;

        texture = new THREE.Texture(this.canvas);
        geometry = new THREE.SphereGeometry(120, 50, 50);
        material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            overdraw: 0.5
        });

        texture.needsUpdate = true;
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        this.group.add(mesh);
    };

    initCloud = data => {
        let loader, geometry, material, mesh;

        loader = new THREE.TextureLoader();
        loader.load(IMAGE_URLS.earthCloud, texture => {
            geometry = new THREE.SphereGeometry(128, 50, 50);

            material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 1
            });

            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, 0);
            this.group.add(mesh);

            // 绑定点击事件
            this.event = new THREE.onEvent(this.scene, this.camera, this.callBack);
            // data = data.splice(0, 20); //最多20个点
            data.forEach((item, index) => {
                let sprite = this.createLocationSprite(item, index);

                this.group.add(sprite);
            });
        });
    };

    callBack = name => {
        message.success(name);
    };

    createLocationSprite = (item, i) => {
        // 创建一个圆形的材质，记得一定要加上texture.needsUpdate = true;
        let canvas;
        let ctx;
        let texture;
        let spriteMaterial;
        let sprite;
        let lags;
        let w = 64;
        let h = 70;
        let r = 15;
        let fontSize = 16;

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        ctx.fillStyle = item.queryEnable === '1' ? '#36d1fe' : '#095ba1';
        ctx.shadowBlur = 10;
        ctx.shadowColor = item.queryEnable === '1' ? '#36d1fe' : '#095ba1';
        ctx.arc(w / 2, 10 + r, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.font = `${fontSize}px Georgia`;
        ctx.fillStyle = item.queryEnable === '1' ? '#fff' : '#a7a6aa';
        ctx.fillText(item.keyword, w / 2 - (item.keyword.length * fontSize) / 2, h - fontSize / 2);

        texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            color: 0xffffff,
            fog: true
        });
        sprite = new THREE.Sprite(spriteMaterial);
        sprite.name = item.keyword;
        lags = this.LngLat2Coordinate(LOCATIONS[i].coord[0], LOCATIONS[i].coord[1], 136);
        sprite.position.set(lags.x, lags.y, lags.z);
        sprite.scale.set(15, 15, 15);

        // sprite.position.normalize();
        sprite.on('click');
        this.clickList.push(sprite);
        return sprite;
    };

    LngLat2Coordinate = (lng, lat, radius) => {
        let lngLat, l, x, y, z;

        lngLat = { lng: lng, lat: lat };
        l = radius * Math.cos((lngLat.lat / 180) * Math.PI);
        x = l * Math.sin((lngLat.lng / 180) * Math.PI);
        y = radius * Math.sin((lngLat.lat / 180) * Math.PI);
        z = l * Math.cos((lngLat.lng / 180) * Math.PI);

        return { x: x, y: y, z: z };
    };

    getTexture = imageSrc => {
        let loader;

        loader = new THREE.TextureLoader();
        return loader.load(IMAGE_URLS[imageSrc]);
    };

    animate = () => {
        if (this.active) {
            this.group.rotation.y += 0.001;
            requestAnimationFrame(this.animate);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }
    };

    componentWillUnmount() {
        this.active = false;
        this.event.removeAll();
        this.clickList.map(item => {
            item.off('click');
        });
        window.onresize = null;
    }

    render() {
        // 请勿更改容器ID
        return (
            <div className={style.container}>
                <div id="canvas-frame" style={{ width: '100%', height: '100%' }} />
            </div>
        );
    }
}
