webpackJsonp([14],{dp0W:function(t,e){t.exports={container:"container__3vXJEm"}},ulzz:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),c=n("GiK3"),h=i(c),u=n("dp0W"),l=i(u),d=function(){function t(e,n,i){for(r(this,t),this.ctx=e,this.x=n,this.y=i,this.hue=this.random(0,360),this.coordinates=[[n,i]],this.coordinatesCount=5,this.w=this.random(1,3);this.coordinatesCount--;)this.coordinates.push([this.x,this.y]);this.speed=this.random(1,10),this.alpha=1,this.friction=.95,this.brightness=this.random(50,80),this.gravity=1,this.angle=this.random(0,2*Math.PI),this.decay=this.random(.015,.02)}return s(t,[{key:"draw",value:function(){this.ctx.beginPath(),this.ctx.moveTo(this.coordinates[this.coordinates.length-1][0],this.coordinates[this.coordinates.length-1][1]),this.ctx.lineTo(this.x,this.y),this.ctx.lineWidth=this.w,this.ctx.strokeStyle="hsla("+this.hue+", 100%, "+this.brightness+"%, "+this.alpha+")",this.ctx.stroke()}},{key:"random",value:function(t,e){return Math.random()*(e-t)+t}},{key:"update",value:function(){this.coordinates.pop(),this.coordinates.unshift([this.x,this.y]),this.speed*=this.friction,this.x+=Math.sin(this.angle)*this.speed,this.y+=Math.cos(this.angle)*this.speed+this.gravity,this.hue+=.5,this.alpha-=this.decay}}]),t}(),f=function(t){function e(){r(this,e);var t=a(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return t.init=function(){var e=document.querySelector("#canvas");e.addEventListener("click",function(e){t.time&&clearInterval(t.time),t.draw(e.pageX,e.pageY-60),t.time=setInterval(function(){t.draw()},1500)},!1),e.width=t.w,e.height=t.h,t.ctx=e.getContext("2d")},t.random=function(t,e){return Math.random()*(e-t)+t},t.draw=function(e,n){t.particles=[],t.animate&&cancelAnimationFrame(t.animate);for(var i=100,a=e||t.random(100,t.w-100),o=n||t.random(50,t.h/2);i--;)t.particles.push(new d(t.ctx,a,o));t.update()},t.update=function(){var e=t.ctx;e.globalCompositeOperation="source-over",e.fillStyle="rgba(0,0,0,0.2)",e.fillRect(0,0,t.w,t.h),e.globalCompositeOperation="lighter";for(var n=t.particles,i=0;i<n.length;i++){var a=n[i];a.update(),a.draw()}t.animate=requestAnimationFrame(function(){t.update()})},t.particles=[],t.w=document.body.clientWidth,t.h=document.body.clientHeight-60,t.padding=50,t.ctx=null,t.animate=null,t.time=null,t}return o(e,t),s(e,[{key:"componentDidMount",value:function(){var t=this;this.init(),this.draw(),this.time=setInterval(function(){t.draw()},1500)}},{key:"componentWillUnmount",value:function(){this.animate&&cancelAnimationFrame(this.animate),this.time&&clearInterval(this.time)}},{key:"render",value:function(){return h.default.createElement("div",{className:l.default.container},h.default.createElement("canvas",{id:"canvas"}))}}]),e}(c.Component);e.default=f}});