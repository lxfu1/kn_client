import React, { Component } from 'react';
import style from './style.scss';
import Panor from '../../images/a36.jpg';
import { Promise } from 'es6-promise';

export default class Panorama extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (document.querySelector('.panorama')) {
            this.initMap();
        } else {
            this.loadScript('/thr/three-h.js').then(res => {
                this.loadScript('/thr/OrbitControls.js').then(r => {
                    this.initMap();
                });
            });
        }
    }

    loadScript = src => {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = src;
            script.className = 'panorama';
            document.body.appendChild(script);
            script.onload = () => {
                resolve();
            };
        });
    };

    initMap = () => {
        var renderer;
        function initRender() {
            renderer = new THREE.WebGLRenderer({ antialias: true });
            // renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0)); //设置背景颜色
            renderer.setSize(
                document.getElementById('panorama').clientWidth,
                document.getElementById('panorama').clientHeight
            );
            document
                .getElementById('panorama')
                .appendChild(renderer.domElement);
        }

        var camera;

        function initCamera() {
            camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                1,
                10000
            );
            camera.position.z = 10;
        }

        var scene;

        function initScene() {
            scene = new THREE.Scene();
        }

        var light;

        function initLight() {}

        var mesh,
            loader = new THREE.TextureLoader();

        function initModel() {
            // 声明一个球体
            var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
            // 反转X轴上的几何图形，使所有的面点向内。
            geometry.scale(-1, 1, 1);
            // 声明球体纹理
            var material = new THREE.MeshBasicMaterial({
                map: loader.load(Panor) // 加载一整张纹理图片
            });
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }

        // 用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
        var controls;

        function initControls() {
            controls = new THREE.OrbitControls(camera, renderer.domElement);

            // 使动画循环使用时阻尼或自转 意思是否有惯性
            controls.enableDamping = true;
            // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
            // controls.dampingFactor = 0.25;
            // 是否可以缩放
            controls.enableZoom = true;
            // 是否自动旋转
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
            // 设置相机距离原点的最远距离
            controls.minDistance = 20;
            // 设置相机距离原点的最远距离
            controls.maxDistance = 200;
            // 是否开启右键拖拽
            controls.enablePan = true;
        }

        function render() {
            renderer.render(scene, camera);
        }

        // 窗口变动触发的函数
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            render();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            // 更新控制器
            controls.update();
            render();
            requestAnimationFrame(animate);
        }

        function draw() {
            initRender();
            initScene();
            initCamera();
            initLight();
            initModel();
            initControls();

            animate();
            window.onresize = onWindowResize;
        }
        draw();
    };

    render() {
        return (
            <div className={style.container}>
                <div id="panorama" style={{ width: '100%', height: '100%' }} />
            </div>
        );
    }
}
