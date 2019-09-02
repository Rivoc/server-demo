//初次完成，组件和效果强绑定，需要解绑
class Carousel {
    constructor(node) {
        this.root = typeof node === "string" ? document.querySelector(node) : node
        //实现两个函数，便于之后获取元素，方便绑定
        this.$ = selector => document.querySelector(selector);
        this.$$ = selector => document.querySelectorAll(selector)
        this.panels = Array.from(this.$$('.carousel .panels a'));//因为后面要遍历到，先提前把nodelist转换成数组
        this.pre = this.$('.carousel .pre');
        this.next = this.$('.carousel .next');
        this.dots = Array.from(this.$$('.carousel .dots span'));
        this.dotsCt = this.$('.carousel .dots')//获取装小圆点的盒子
        this.bind()//绑事件
    }
    showImage(index){
        this.$$('.carousel .panels>a').forEach((panel)=>panel.style.zIndex=0)//
        this.$$('.carousel .panels>a')[index].style.zIndex=1;//这两行其实是动画完毕后最终显示的效果
    }
    setDots(index){
        this.$$('.carousel .dots span').forEach((dots)=>dots.classList.remove('active'))
        this.$$('.carousel .dots span')[index].classList.add('active')
    }
    get index(){//使用get关键字把getIndex当作属性来访问
        return this.dots.indexOf(this.$('.dots .active'))//获得当前被激活（也就是被点击）的小圆点下标
    }
    get preIndex(){//根据当前下标查找上一个下标
        return (this.index-1+this.dots.length)%this.dots.length//1.这里的this.index正是上面的index属性 2.上一张图片的索引本为index-1，但是会出现-1的情况，故加上this.dots.length保证不会出现负数 %this.dots.length是保证index永远在0-this.dots.length-1范围内循环
    }
    get nextIndex(){
        return (this.index+1)%this.dots.length//索引不会为负，故不加this.dots.length
    }
    bind() {
        //给dot绑定事件
        this.dotsCt.onclick = e => {//给小圆点的父元素绑定事件，使得不用遍历小圆点就可以实现小圆点点击事件
            if (e.target.tagName!== "SPAN") {//如果点击的不是小圆点就什么也不做
                return
            }
            let index = this.dots.indexOf(e.target)//获得被点击的小圆点的下标
            this.setDots(index)
            this.showImage(index)
            //给"上一张"、"下一张"绑定事件
            this.pre.onclick=e=>{
                this.showImage(this.preIndex);//先显示图片再变更小圆点，顺序不可乱，因为小圆点变化，index也会变
                this.setDots(this.preIndex)
            }
            this.next.onclick=e=>{
                this.showImage(this.nextIndex);
                this.setDots(this.nextIndex)
            }

        }
    }

}

var p = new Carousel('.carousel')