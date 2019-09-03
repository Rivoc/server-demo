//组件和效果的解绑
class Carousel {
  constructor(node, animation) {
    this.root = typeof node === "string" ? document.querySelector(node) : node
    this.animation = animation || ((callback, fromNode, toNode) => callback())
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
  showImage(fromIndex, toIndex) {
    //animation函数传递3个参数，分别为起点页面dom元素，终点页面dom元素，动画执行完毕后的回调
    this.animation(this.panels[fromIndex], this.panels[toIndex], () => {
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
      this.showImage(lastIndex, index)
      //给"上一张"、"下一张"绑定事件
      this.pre.onclick = e => {
        this.showImage(this.index, this.preIndex);//先显示图片再变更小圆点，顺序不可乱，因为小圆点变化，index也会变
        this.setDots(this.preIndex)
        console.log(this.index)
      }
      this.next.onclick = e => {
        this.showImage(this.index, this.nextIndex);
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

// const Animation = (function(){//一个立即执行函数
//     const css = (node, styles) => Object.entries(styles)//一个名为css的函数，可以设置节点的css，Object.entries()可以把一个对象的键值以数组的形式遍历出来,
//     .forEach(([key, value]) => node.style[key] = value)//给节点加上css
//     const reset = node => node.style = ''


const Animation = {
  fade(step = 0.04) {
    return function (fromNode, toNode, onFinish) {
      console.log(fromNode, toNode)
      let opacityOffset1 = 1
      let opacityOffset2 = 0
      fromNode.style.zIndex = 10
      toNode.style.zIndex = 9

      function fromNodeAnimation() {
        if (opacityOffset1 > 0) {
          opacityOffset1 -= step
          fromNode.style.opacity = opacityOffset1
          requestAnimationFrame(fromNodeAnimation)
        } else {
          fromNode.style.opacity = 0
        }
      }

      function toNodeAnimation() {
        if (opacityOffset2 < 1) {
          opacityOffset2 += step
          toNode.style.opacity = opacityOffset2
          requestAnimationFrame(toNodeAnimation)
        } else {
          fromNode.style.opacity = 1
          toNode.style.opacity = 1
          onFinish()
        }

      }

      fromNodeAnimation()
      toNodeAnimation()
    }
  },

  slide(step = 10) {
    return function (fromNode, toNode, onFinish) {
      fromNode.style.zIndex = 10
      toNode.style.zIndex = 10

      let width = parseInt(getComputedStyle(fromNode).width)
      let offsetX = width  //要水平移动的举例
      let offset1 = 0  //第一个元素已经移动的举例
      let offset2 = 0 //第二个元素已经移动的举例
      //let step = 10   //每次移动的举例

      toNode.style.left = width + 'px'

      function fromNodeAnimation() {
        if (offset1 < offsetX) {
          fromNode.style.left = parseInt(getComputedStyle(fromNode).left) - step + 'px'
          offset1 += step
          requestAnimationFrame(fromNodeAnimation)
        }
      }

      function toNodeAnimation() {
        if (offset2 < offsetX) {
          toNode.style.left = parseInt(getComputedStyle(toNode).left) - step + 'px'
          offset2 += step
          requestAnimationFrame(toNodeAnimation)
        } else {
          onFinish()
          fromNode.style.left = 0
          toNode.style.left = 0
        }
      }

      fromNodeAnimation()
      toNodeAnimation()
    }

  },

  cssSlide(during = .3) {
    const css = (node, styles) => Object.entries(styles).forEach(([key, value]) => node.style[key] = value)

    return function (fromNode, toNode, onFinish) {
      //获取图片的宽，fromNodeIndex，toNodeIndex
      let width = parseInt(getComputedStyle(fromNode).width)
      let fromNodeIndex = Array.from(fromNode.parentElement.children).indexOf(fromNode)
      let toNodeIndex = Array.from(toNode.parentElement.children).indexOf(toNode)
      //动画开始，对fromNode、toNode的css样式进行设置
      css(fromNode, {
        zIndex: 10,
        transition: `transform ${during}s`,//设置补间时间
        transform: `translateX(${fromNodeIndex < toNodeIndex ? '-' : ''}100%)`
      })//如果fromNodeIndex小于toNodeIndex则向左滑，大于则向右滑
      css(toNode, {
        zIndex: 10,
        left: `${fromNodeIndex < toNodeIndex ? '' : '-'}${width}px`,//向左滑，toNode放在右边，向右滑，放在最左边
        transition: `transform ${during}s`,
        transform: `translateX(${fromNodeIndex < toNodeIndex ? '-' : ''}100%)`
      })

      setTimeout(() => {//动画结束后取消fromNode和toNode的过渡效果，并将translateX恢复到原始状态
        css(fromNode, {
          transition: 'none',
          transform: `translateX(0)`
        })

        css(toNode, {
          left: 0,
          transition: 'none',
          transform: `translateX(0)`
        })

        onFinish()//最终状态，层叠关系变化
      }, during * 1000)

    }
  },

  cssZoom(during = .3) {
    const css = (node, styles) => Object.entries(styles).forEach(([key, value]) => node.style[key] = value)

    return function (fromNode, toNode, onFinish) {
      css(fromNode, {
        zIndex: 10,
        transition: `all ${during}s`,
        transform: `scale(5)`,
        opacity: 0
      })

      css(toNode, {
        zIndex: 9
      })

      setTimeout(() => {
        css(fromNode, {
          transition: 'none',
          transform: `none`,
          opacity: 1
        })
        onFinish()
      }, during * 1000)

    }
  }

}

// const carousel = new Carousel('.carousel',Animation.fade(300))
const carousel = new Carousel('.carousel', Animation.cssZoom())
document.querySelector('select').onchange = function(e) {
  carousel.setAnimation(Animation[this.value]())
}