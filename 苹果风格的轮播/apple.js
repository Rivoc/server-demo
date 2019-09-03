class Carousel {
    constructor(node) {
        this.root = typeof root === "string" ? document.querySelector(node) : node; //p根据传入的是字符串或选择器做不同的处理
        this.$ = selector => document.querySelector(selector);
        this.$$ = selector => document.querySelectorAll(selector); //定义两个方便获取元素的方法
        this.panelsCt = this.$(".panels");
        this.panels = [...this.$$(".panels a")]; //获取包裹图片的a标签
        this.pre = this.$(".carousel .pre");
        this.next = this.$(".carousel .next");
        this.dots = [...(this.$$(".carousel .dots span"))]; //小圆点
        this.dotsCt = this.$(".carousel .dots"); //获取装小圆点的盒子
        this.bind(); 
    }
    debounce(fn, wait) {
        var timer = null; //创建一个标记储存定时器的返回值
        return function () {
            var context = this;
            var args = arguments;
            if (timer) {
                //当用户点击时清除上一次的定时器
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, wait);
        };
    }
    bind() {
        this.dotsCt.onclick = (e) => {
            if (e.target.tagName !== "SPAN") {
                //如果点击的不是小圆点，就终止
                return;
            }
            var index = this.dots.indexOf(e.target); //获取当前被点击的小圆点下标
            this.showImage(this.panels[this.index], this.panels[index]);
            this.setDots(index);
        };
        this.pre.addEventListener('click', throttle(() => {//使用箭头函数的方式就不会改变this指向
            this.showImage(this.panels[this.index], this.panels[this.preIndex])
            this.setDots(this.preIndex)
        }, 500))

        this.next.addEventListener('click', throttle(() => {
            this.showImage(this.panels[this.index], this.panels[this.nextIndex]);
            this.setDots(this.nextIndex)
        }, 500))
        //节流函数
        function throttle(fn, delay) {
            var delay = delay || 1000; //没有传入delay，默认延迟1s
            let canRun = true;
            // 通过闭包保存一个标记，当作一个开关，只有setTimeout执行后,开关才为开启，标志变为ture;
            return function () {
                //在函数开头判断标志是否为 true，不为 true 则中断函数
                if (!canRun) {
                    return;
                }
                canRun = false; //将 canRun 设置为 false，防止执行之前再被执行
                setTimeout(() => {
                    fn.call(this, arguments);
                    canRun = true;
                }, delay);
            };
        }
    }
    get index() {
        //获取当前被激活的小圆点的下标
        return this.dots.indexOf(this.$("span.active"));
    }
    get preIndex() {
        //获取当前激活的小圆点的上一个坐标
        return (this.index - 1 + this.dots.length) % this.dots.length;
    }
    get nextIndex() {
        return (this.index + 1) % this.dots.length;
    }
    setDots(index) {
        this.$$(".carousel .dots span").forEach(dot =>
            dot.classList.remove("active")
        );
        this.$$(".carousel .dots span")[index].classList.add("active");
    }
    showImage(fromNode, toNode) {
        const css = (node, styles) =>
            Object.entries(styles).forEach(
                ([key, value]) => (node.style[key] = value)
            );
        let fromNodeIndex = Array.from(fromNode.parentElement.children).indexOf(
            fromNode
        );
        let toNodeIndex = Array.from(toNode.parentElement.children).indexOf(toNode);
        let width = parseInt(getComputedStyle(fromNode).width); //获取图片宽度
        if (toNodeIndex == 0 && fromNodeIndex == this.dots.length-1) {
            css(fromNode, {
                zIndex: 10,
                transition: `transform .5s`, //设置补间时间
                transform: `translateX(-100%)`
            }); 
            css(toNode, {
                zIndex: 10,
                left: `${width}px`, 
                transition: `transform .5s`,
                transform: 'translateX(-100%)'
            });
        }
        else if(toNodeIndex == this.dots.length-1 && fromNodeIndex == 0){
            css(fromNode, {
                zIndex: 10,
                transition: `transform .5s`, //设置补间时间
                transform: `translateX(100%)`
            }); 
            css(toNode, {
                zIndex: 10,
                left: `${-width}px`, 
                transition: `transform .5s`,
                transform: 'translateX(100%)'
            });
        }
        else{
        css(fromNode, {//用Object.entries方法可以转化成例如[[zIndex,10]]
            zIndex: 1,
            transition: `transform .5s`, //设置补间时间
            transform: `translateX(${fromNodeIndex < toNodeIndex ? "-" : ""}100%)`
        }); //判断左滑还是右滑，如果fromNodeIndex小于toNodeIndex则向左滑，大于则向右滑
        css(toNode, {
            zIndex: 1,
            left: `${fromNodeIndex < toNodeIndex ? "" : "-"}${width}px`, //向左滑，toNode放在右边，向右滑，放在最左边
            transition: `transform .5s`,
            transform: `translateX(${fromNodeIndex < toNodeIndex ? "-" : ""}100%)`
        })
    }
        //0.5s动画结束，取消元素的过渡属性，并复原位置
        setTimeout(() => {
            //动画结束后取消fromNode和toNode的过渡效果，并将translateX恢复到原始状态
            css(fromNode, {
                transition: "none",
                transform: `translateX(0)`
            });

            css(toNode, {
                left: 0,
                transition: "none",
                transform: `translateX(0)`
            });
            //元素的最终状态，复原元素的z-index的值
            this.$$(".carousel .panels>a").forEach(panel => (panel.style.zIndex = 0)); //
            this.$$(".carousel .panels>a")[this.index].style.zIndex = 1; //最终状态，层叠关系变化
        }, 500);
    }
}
var p = new Carousel(".carousel");
