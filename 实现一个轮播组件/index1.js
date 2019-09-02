//组件和效果的解绑
class Carousel {
    constructor(node, animation) {
        this.root = typeof node === "string" ? document.querySelector(node) : node
        this.animation = animation || ((callback,fromNode,toNode) => callback())
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
    //showImage传递2个参数,toIndex 表示要切换到的页面(终点页面)序号,fromIndex 表示从哪个页面(起始页面)切换过来
    showImage(fromIndex,toIndex) {
          //animation函数传递3个参数，分别为起点页面dom元素，终点页面dom元素，动画执行完毕后的回调
        this.animation(this.panels[fromIndex],this.panels[toIndex],() => {
            this.$$('.carousel .panels>a').forEach((panel) => panel.style.zIndex = 0)//
            this.$$('.carousel .panels>a')[this.index].style.zIndex = 1;//这两行其实是动画完毕后最终显示的效果,所以，作为回调函数
        })
    }
    setDots(index) {
        this.$$('.carousel .dots span').forEach((dots) => dots.classList.remove('active'))
        this.$$('.carousel .dots span')[index].classList.add('active')
    }
    get index() {//使用get关键字把getIndex当作属性来访问
        return this.dots.indexOf(this.$('.dots .active'))//获得当前被激活（也就是被点击）的小圆点下标
    }
    get preIndex() {//根据当前下标查找上一个下标
        return (this.index - 1 + this.dots.length) % this.dots.length//1.这里的this.index正是上面的index属性 2.上一张图片的索引本为index-1，但是会出现-1的情况，故加上this.dots.length保证不会出现负数 %this.dots.length是保证index永远在0-this.dots.length-1范围内循环
    }
    get nextIndex() {
        return (this.index + 1) % this.dots.length//索引不会为负，故不加this.dots.length
    }
    bind() {
        //给dot绑定事件
        this.dotsCt.onclick = e => {//给小圆点的父元素绑定事件，使得不用遍历小圆点就可以实现小圆点点击事件
            if (e.target.tagName !== "SPAN") {//如果点击的不是小圆点就什么也不做
                return
            }
            let lastIndex = this.index//先保存点击之前激活的小圆点的下标
            let index = this.dots.indexOf(e.target)//获得被点击的小圆点的下标
            this.setDots(index)
            this.showImage(lastIndex,index)
            //给"上一张"、"下一张"绑定事件
            this.pre.onclick = e => {
                this.showImage(this.index,this.preIndex);//先显示图片再变更小圆点，顺序不可乱，因为小圆点变化，index也会变
                this.setDots(this.preIndex)
                console.log(this.index)
            }
            this.next.onclick = e => {
                this.showImage(this.index,this.nextIndex);
                this.setDots(this.nextIndex)
            }

        }
    }
    setAnimation(animation) {
        this.animation = animation
      }
}

// function fade(fromNode,toNode,callback){定义一个动画，穿三个参数，最后一个参数是回调函数，执行完动画后，调用此回调函数，将对象恢复成最后的状态
//     console.log(fromNode)
//     console.log(toNode)
//     callback();
// }

const Animation = (function(){//一个立即执行函数
    const css = (node, styles) => Object.entries(styles)//一个名为css的函数，可以设置节点的css，Object.entries()可以把一个对象的键值以数组的形式遍历出来,
    .forEach(([key, value]) => node.style[key] = value)//给节点加上css
    const reset = node => node.style = ''
  
    return {
      fade(during) {//during即是动画的持续时间
        return function(from, to, onFinish) {//返回一个函数，这个函数用来给节点加样式
          css(from, {//会得到[['opacity',1]]……
            opacity: 1,
            transition: `all ${during/1000}s`,//动画持续时间，转化成秒
            zIndex: 1
          })
          css(to, {
            opacity: 0,
            transition: `all ${during/1000}s`,
            zIndex: 0
          })
  
          setTimeout(() => {
            css(from, {
              opacity: 0,
            })
            css(to, {
              opacity: 1,
              
            })              
          }, 100)//0.1s后，变更节点的透明度，开始动画
  
          setTimeout(() => {//动画结束后，把节点恢复成最原始的状态(不含任何行内样式)，之后会回调，节点变成最终状态
            reset(from)
            reset(to)
            onFinish && onFinish()//同if(onFinish){onFinish()}
          }, during)
  
        }
      },
  
      zoom(scale,during) {
        return function(from, to, onFinish) {
          css(from, {
            opacity: 1,
            transform: `scale(1)`,
            transition: `all ${during/1000}s`,
            zIndex: 1
          })
          css(to, {
            opacity: 1,
            zIndex: 0
          })
  
          setTimeout(() => {//样式改变，动画开始
            css(from, {
              zIndex: 10,
              opacity: 0,
              transform: `scale(${scale})`
            })
            css(to, {
              opacity: 1,
              zIndex: 9,
            })
             console.log('改了')        
          }, 100)
  
          setTimeout(() => {
            reset(from)
            reset(to)
            onFinish && onFinish()
            console.log('改完了')
          }, 5000)
        }
      }
    }
  })()

// const carousel = new Carousel('.carousel',Animation.fade(300))
const carousel = new Carousel('.carousel',Animation.zoom(5,2000))
// document.querySelector('select').onchange = function(e) {
//   carousel.setAnimation(Animation[this.value]())
// }