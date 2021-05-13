document.addEventListener('DOMContentLoaded', function () {
  const $blogName = document.getElementById('site-name')
  let blogNameWidth = $blogName && $blogName.offsetWidth
  const $menusEle = document.querySelector('#menus .menus_items')
  let menusWidth = $menusEle && $menusEle.offsetWidth
  const $searchEle = document.querySelector('#search-button')
  let searchWidth = $searchEle && $searchEle.offsetWidth

  const adjustMenu = (change = false) => {
    if (change) {
      blogNameWidth = $blogName && $blogName.offsetWidth
      menusWidth = $menusEle && $menusEle.offsetWidth
      searchWidth = $searchEle && $searchEle.offsetWidth
    }
    const $nav = document.getElementById('nav')
    let t
    if (window.innerWidth < 768) t = true
    else t = blogNameWidth + menusWidth + searchWidth > $nav.offsetWidth - 120

    if (t) {
      $nav.classList.add('hide-menu')
    } else {
      $nav.classList.remove('hide-menu')
    }
  }

  // 初始化header
  const initAdjust = () => {
    adjustMenu()
    document.getElementById('nav').classList.add('show')
  }

  // sidebar menus
  const sidebarFn = () => {
    const $toggleMenu = document.getElementById('toggle-menu')
    const $mobileSidebarMenus = document.getElementById('sidebar-menus')
    const $menuMask = document.getElementById('menu-mask')
    const $body = document.body

    function openMobileSidebar () {
      btf.sidebarPaddingR()
      $body.style.overflow = 'hidden'
      btf.fadeIn($menuMask, 0.5)
      $mobileSidebarMenus.classList.add('open')
    }

    function closeMobileSidebar () {
      $body.style.overflow = ''
      $body.style.paddingRight = ''
      btf.fadeOut($menuMask, 0.5)
      $mobileSidebarMenus.classList.remove('open')
    }

    $toggleMenu.addEventListener('click', openMobileSidebar)

    $menuMask.addEventListener('click', e => {
      if ($mobileSidebarMenus.classList.contains('open')) {
        closeMobileSidebar()
      }
    })

    window.addEventListener('resize', e => {
      if (btf.isHidden($toggleMenu)) {
        if ($mobileSidebarMenus.classList.contains('open')) closeMobileSidebar()
      }
    })
  }

  //添加moc3 l2d 开始
  //1、添加l2d容器
  let l2dContainerNode = document.createElement("div")
  l2dContainerNode.innerHTML = `
    <div id="audiodiv" style="display:none">
      <audio id="qgirlvoiceAudio" src="" controls="controls">
      </audio>
    </div>
    <div id="qgirlMessage" style="visibility:hidden;position: fixed; opacity: 1; right: 30px; bottom: 190px;z-index:99;width:160px;background-color:#6969698a;color:white;padding:10px;font-size:12px;border-radius:20px">店长，不查看一下终端的信息吗？……或许，有很重要的事呢</div>  

    <div class="Canvas" id="L2dCanvas" style="position: fixed; opacity: 1; right: 30px; bottom: -160px;z-index:99">
      <canvas width="400" height="640" style="touch-action: none; cursor: inherit; width: 400px; height: 640px;"></canvas>
    </div>
  `
  document.body.append(l2dContainerNode)
  //2、添加script标签
  let script = document.createElement("script");
  script.innerHTML = `
  class Viewer {
    constructor(config) {
      let width = config.width || 800;
      let height = config.height || 600;
      let role = config.role;
      let left = config.left; //|| '0px'
      let top = config.top; //|| '0px'
      let right = config.right; //|| '0px'
      let bottom = config.bottom; //|| '0px'
      let bg = config.background;
      let opa = config.opacity;
      let mobile = config.mobile;
  
      if (!mobile) {
        if (this.isMobile()) return;
      }
      this.l2d = new L2D(config.basePath);
      this.canvas = $(".Canvas");
  
      this.l2d.load(role, this);
      this.app = new PIXI.Application({
        width: width,
        height: height,
        transparent: true,
        antialias: true, // 抗锯齿
      });
      this.canvas.html(this.app.view);
      this.canvas[0].style.position = "fixed";
      if (bg) {
        this.canvas[0].style.background = "url('"+ bg + "')";
        this.canvas[0].style.backgroundSize = "cover";
      }
      if (opa) this.canvas[0].style.opacity = opa;
      if (top) this.canvas[0].style.top = top;
      if (right) this.canvas[0].style.right = right;
      if (bottom) this.canvas[0].style.bottom = bottom;
      if (left) this.canvas[0].style.left = left;
  
      this.app.ticker.add((deltaTime) => {
        if (!this.model) {
          return;
        }
  
        this.model.update(deltaTime);
        this.model.masks.update(this.app.renderer);
      });
  
      window.onresize = (event) => {
        if (event === void 0) {
          event = null;
        }
  
        this.app.view.style.width = width + "px";
        this.app.view.style.height = height + "px";
        this.app.renderer.resize(width, height);
  
        if (this.model) {
          this.model.position = new PIXI.Point(width * 0.45, height * 0.36);
          // this.model.scale = new PIXI.Point((this.model.position.x * 0.6), (this.model.position.x * 0.6));
          //修改moc3模型显示的放大倍数，这里用的是双生视界的moc3模型，它有点特殊，模型普遍偏小，所以这里面倍数变大，如果你的模型显示太大，请修改这里的放大倍数
          this.model.scale = new PIXI.Point(width * 1, height * 0.6);
          this.model.masks.resize(this.app.view.width, this.app.view.height);
        }
      };
      this.isClick = false;
      this.app.view.addEventListener("mousedown", (event) => {
        this.isClick = true;
      });
      this.app.view.addEventListener("mousemove", (event) => {
        if (this.isClick) {
          this.isClick = false;
          if (this.model) {
            this.model.inDrag = true;
          }
        }
  
        if (this.model) {
          let mouse_x = this.model.position.x - event.offsetX;
          let mouse_y = this.model.position.y - event.offsetY;
          this.model.pointerX = -mouse_x / this.app.view.height;
          this.model.pointerY = -mouse_y / this.app.view.width;
        }
      });

      //语音数组，播放语音的地址
      const arrVoice = ["https://www.joy127.com/url/77696.mp3","https://www.joy127.com/url/77697.mp3","https://www.joy127.com/url/77698.mp3","https://www.joy127.com/url/77699.mp3","https://www.joy127.com/url/77700.mp3","https://www.joy127.com/url/77701.mp3"]
      //语音对应的文字
      const arrText = ["店长要来一杯咖啡么?","愿所有的牺牲者得以安息","一定不存在不需要战争也能解决纠纷的办法","店长，不查看一下终端的信息吗？……或许，有很重要的事呢","店长今天的检查结果也ok","咖啡馆里又发生了什么呢？要不要去看看"]
      this.app.view.addEventListener("mouseup", (event) => {
        if (!this.model) {
          return;
        }
        this.isClick = true;
        if (this.isClick) {
          console.log("onclicked")
          if (this.isHit("TouchHead", event.offsetX, event.offsetY)) {
            this.startAnimation("touch_head", "base");
          } else if (this.isHit("TouchSpecial", event.offsetX, event.offsetY)) {
            this.startAnimation("touch_special", "base");
          } else {
            //你所使用的moc3模型的motions文件夹下的所有motions名称数组
            const bodyMotions = ["Mgirl07_baohaibao","Mgirl07_baohaibao_a","Mgirl07_baolu_c","Mgirl07_dahaqian_c","Mgirl07_dazhaohu_a","Mgirl07_diantou","Mgirl07_ganga_c","Mgirl07_haixiu","Mgirl07_jiashengqi","Mgirl07_jingxi_a","Mgirl07_jingya","Mgirl07_keai_a","Mgirl07_kunao","Mgirl07_motouweixiao","Mgirl07_motouwushi_c","Mgirl07_motouxiao_a","Mgirl07_nu","Mgirl07_qidao","Mgirl07_qinwenshizijia_a","Mgirl07_sajiao_a","Mgirl07_sikao_a","Mgirl07_stand","Mgirl07_stand_a","Mgirl07_stand_c","Mgirl07_tianxiao_a","Mgirl07_touteng_c","Mgirl07_tuoyeganga_c","Mgirl07_tuoyehaixiu","Mgirl07_tuoyehaixiu_a","Mgirl07_tuoyeyihuo","Mgirl07_wuzhu","Mgirl07_xianqi_c","Mgirl07_xianqunzi","Mgirl07_xianqunzi_a","Mgirl07_xiugongpai_a","Mgirl07_xiunu_a","Mgirl07_yihuo"];
            //点击随机一个motion
            let currentMotion =
              bodyMotions[Math.floor(Math.random() * bodyMotions.length)];
            //随机播放语音1-6
            let rand = Math.floor(Math.random()*6);
            $("#qgirlvoiceAudio")[0].src = arrVoice[rand];
            $("#qgirlvoiceAudio")[0].play();
            //显示对应文字,2秒后将其关闭
            const node = document.getElementById("qgirlMessage")
            node.style.visibility = "visible"

            node.innerText = arrText[rand]
            setTimeout(()=>{
              node.style.visibility = "hidden"
            },2000)

            this.startAnimation(currentMotion, "base");
          }
        }
  
        this.isClick = false;
        this.model.inDrag = false;
      });
      console.log("Init finished.");
    }
  
    changeCanvas(model) {
      this.app.stage.removeChildren();
  
      model.motions.forEach((value, key) => {
        if (key != "effect") {
          let btn = document.createElement("button");
          let label = document.createTextNode(key);
          btn.appendChild(label);
          btn.className = "btnGenericText";
          btn.addEventListener("click", () => {
            this.startAnimation(key, "base");
          });
        }
      });
  
      this.model = model;
      this.model.update = this.onUpdate; // HACK: use hacked update fn for drag support
      // console.log(this.model);
      this.model.animator.addLayer(
        "base",
        LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE,
        1
      );
  
      this.app.stage.addChild(this.model);
      this.app.stage.addChild(this.model.masks);
  
      window.onresize();
    }
  
    onUpdate(delta) {
      let deltaTime = 0.016 * delta;
  
      if (!this.animator.isPlaying) {
        let m = this.motions.get("idle");
        this.animator.getLayer("base").play(m);
      }
      this._animator.updateAndEvaluate(deltaTime);
  
      if (this.inDrag) {
        this.addParameterValueById("ParamAngleX", this.pointerX * 30);
        this.addParameterValueById("ParamAngleY", -this.pointerY * 30);
        this.addParameterValueById("ParamBodyAngleX", this.pointerX * 10);
        this.addParameterValueById("ParamBodyAngleY", -this.pointerY * 10);
        this.addParameterValueById("ParamEyeBallX", this.pointerX);
        this.addParameterValueById("ParamEyeBallY", -this.pointerY);
      }
  
      if (this._physicsRig) {
        this._physicsRig.updateAndEvaluate(deltaTime);
      }
  
      this._coreModel.update();
  
      let sort = false;
      for (let m = 0; m < this._meshes.length; ++m) {
        this._meshes[m].alpha = this._coreModel.drawables.opacities[m];
        this._meshes[m].visible = Live2DCubismCore.Utils.hasIsVisibleBit(
          this._coreModel.drawables.dynamicFlags[m]
        );
        if (
          Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(
            this._coreModel.drawables.dynamicFlags[m]
          )
        ) {
          this._meshes[m].vertices = this._coreModel.drawables.vertexPositions[m];
          this._meshes[m].dirtyVertex = true;
        }
        if (
          Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(
            this._coreModel.drawables.dynamicFlags[m]
          )
        ) {
          sort = true;
        }
      }
  
      if (sort) {
        this.children.sort((a, b) => {
          let aIndex = this._meshes.indexOf(a);
          let bIndex = this._meshes.indexOf(b);
          let aRenderOrder = this._coreModel.drawables.renderOrders[aIndex];
          let bRenderOrder = this._coreModel.drawables.renderOrders[bIndex];
  
          return aRenderOrder - bRenderOrder;
        });
      }
  
      this._coreModel.drawables.resetDynamicFlags();
    }
  
    startAnimation(motionId, layerId) {
      if (!this.model) {
        return;
      }
      console.log("Animation:", motionId, layerId);
      let m = this.model.motions.get(motionId);
      console.log("motionId:", m);
      if(m){m.loop = false};
      if (!m) {
        return;
      }
  
      let l = this.model.animator.getLayer(layerId);
      console.log("layerId:", l)
      if (!l) {
        return;
      }
  
      l.play(m);
    }
  
    isHit(id, posX, posY) {
      if (!this.model) {
        return false;
      }
  
      let m = this.model.getModelMeshById(id);
      if (!m) {
        return false;
      }
  
      const vertexOffset = 0;
      const vertexStep = 2;
      const vertices = m.vertices;
  
      let left = vertices[0];
      let right = vertices[0];
      let top = vertices[1];
      let bottom = vertices[1];
  
      for (let i = 1; i < 4; ++i) {
        let x = vertices[vertexOffset + i * vertexStep];
        let y = vertices[vertexOffset + i * vertexStep + 1];
  
        if (x < left) {
          left = x;
        }
        if (x > right) {
          right = x;
        }
        if (y < top) {
          top = y;
        }
        if (y > bottom) {
          bottom = y;
        }
      }
  
      let mouse_x = m.worldTransform.tx - posX;
      let mouse_y = m.worldTransform.ty - posY;
      let tx = -mouse_x / m.worldTransform.a;
      let ty = -mouse_y / m.worldTransform.d;
  
      return left <= tx && tx <= right && top <= ty && ty <= bottom;
    }
  
    isMobile() {
      var WIN = window;
      var LOC = WIN["location"];
      var NA = WIN.navigator;
      var UA = NA.userAgent.toLowerCase();
      function test(needle) {
        return needle.test(UA);
      }
      var IsAndroid = test(/android|htc/) || /linux/i.test(NA.platform + "");
      var IsIPhone = !IsAndroid && test(/ipod|iphone/);
      var IsWinPhone = test(/windows phone/);
      var device = {
        IsAndroid: IsAndroid,
        IsIPhone: IsIPhone,
        IsWinPhone: IsWinPhone,
      };
      var documentElement = WIN.document.documentElement;
      for (var i in device) {
        if (device[i]) {
          documentElement.className += " " + i.replace("Is", "").toLowerCase();
        }
      }
      return device.IsAndroid || device.IsIPhone || device.IsWinPhone;
    }
  }
  
  //let width = document.documentElement.clientWidth
  // let height = document.documentElement.clientHeight
  //moc3模型的在线地址，使用jsdelivr加速github仓库访问
  //可以自建gitHub仓库，将moc3 l2d提交到仓库（注意一个仓库最多只有50M）
  //因为jsdelivr对超过50M的仓库不予加速
  //jsdelivr的使用请自行百度
  var config = {
    width: 200,
    height: 320,
    right: "0px",
    bottom: "-100px",
    basePath: "https://cdn.jsdelivr.net/gh/Hexi1997/ailin@1.0/assets",
    role: "sifu",
    background: false,
    opacity: 1,
    mobile: false
  };
  var v = new Viewer(config);
  `;

  document.head.appendChild(script);
  //添加moc3 l2d 结束
  
  /**
 * 首頁top_img底下的箭頭
 */
  const scrollDownInIndex = () => {
    const $scrollDownEle = document.getElementById('scroll-down')
    $scrollDownEle && $scrollDownEle.addEventListener('click', function () {
      btf.scrollToDest(document.getElementById('content-inner').offsetTop, 300)
    })
  }

  /**
 * 代碼
 * 只適用於Hexo默認的代碼渲染
 */
  const addHighlightTool = function () {
    const highLight = GLOBAL_CONFIG.highlight
    if (!highLight) return

    const isHighlightCopy = highLight.highlightCopy
    const isHighlightLang = highLight.highlightLang
    const isHighlightShrink = GLOBAL_CONFIG_SITE.isHighlightShrink
    const highlightHeightLimit = highLight.highlightHeightLimit
    const isShowTool = isHighlightCopy || isHighlightLang || isHighlightShrink !== undefined
    const $figureHighlight = highLight.plugin === 'highlighjs' ? document.querySelectorAll('figure.highlight') : document.querySelectorAll('pre[class*="language-"]')

    if (!((isShowTool || highlightHeightLimit) && $figureHighlight.length)) return

    const isPrismjs = highLight.plugin === 'prismjs'

    let highlightShrinkEle = ''
    let highlightCopyEle = ''
    const highlightShrinkClass = isHighlightShrink === true ? 'closed' : ''

    if (isHighlightShrink !== undefined) {
      highlightShrinkEle = `<i class="fas fa-angle-down expand ${highlightShrinkClass}"></i>`
    }

    if (isHighlightCopy) {
      highlightCopyEle = '<div class="copy-notice"></div><i class="fas fa-paste copy-button"></i>'
    }

    const copy = (text, ctx) => {
      if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        document.execCommand('copy')
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
          btf.snackbarShow(GLOBAL_CONFIG.copy.success)
        } else {
          const prevEle = ctx.previousElementSibling
          prevEle.innerText = GLOBAL_CONFIG.copy.success
          prevEle.style.opacity = 1
          setTimeout(() => { prevEle.style.opacity = 0 }, 700)
        }
      } else {
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
          btf.snackbarShow(GLOBAL_CONFIG.copy.noSupport)
        } else {
          ctx.previousElementSibling.innerText = GLOBAL_CONFIG.copy.noSupport
        }
      }
    }

    // click events
    const highlightCopyFn = (ele) => {
      const $buttonParent = ele.parentNode
      $buttonParent.classList.add('copy-true')
      const selection = window.getSelection()
      const range = document.createRange()
      if (isPrismjs) range.selectNodeContents($buttonParent.querySelectorAll('pre code')[0])
      else range.selectNodeContents($buttonParent.querySelectorAll('table .code pre')[0])
      selection.removeAllRanges()
      selection.addRange(range)
      const text = selection.toString()
      copy(text, ele.lastChild)
      selection.removeAllRanges()
      $buttonParent.classList.remove('copy-true')
    }

    const highlightShrinkFn = (ele) => {
      const $nextEle = [...ele.parentNode.children].slice(1)
      ele.firstChild.classList.toggle('closed')
      if (btf.isHidden($nextEle[$nextEle.length - 1])) {
        $nextEle.forEach(e => { e.style.display = 'block' })
      } else {
        $nextEle.forEach(e => { e.style.display = 'none' })
      }
    }

    const highlightToolsFn = function (e) {
      const $target = e.target.classList
      if ($target.contains('expand')) highlightShrinkFn(this)
      else if ($target.contains('copy-button')) highlightCopyFn(this)
    }

    const expandCode = function () {
      this.classList.toggle('expand-done')
    }

    function createEle (lang, item, service) {
      const fragment = document.createDocumentFragment()

      if (isShowTool) {
        const hlTools = document.createElement('div')
        hlTools.className = `highlight-tools ${highlightShrinkClass}`
        hlTools.innerHTML = highlightShrinkEle + lang + highlightCopyEle
        hlTools.addEventListener('click', highlightToolsFn)
        fragment.appendChild(hlTools)
      }

      if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30) {
        const ele = document.createElement('div')
        ele.className = 'code-expand-btn'
        ele.innerHTML = '<i class="fas fa-angle-double-down"></i>'
        ele.addEventListener('click', expandCode)
        fragment.appendChild(ele)
      }

      if (service === 'hl') {
        item.insertBefore(fragment, item.firstChild)
      } else {
        item.parentNode.insertBefore(fragment, item)
      }
    }

    if (isHighlightLang) {
      if (isPrismjs) {
        $figureHighlight.forEach(function (item) {
          const langName = item.getAttribute('data-language') ? item.getAttribute('data-language') : 'Code'
          const highlightLangEle = `<div class="code-lang">${langName}</div>`
          btf.wrap(item, 'figure', '', 'highlight')
          createEle(highlightLangEle, item)
        })
      } else {
        $figureHighlight.forEach(function (item) {
          let langName = item.getAttribute('class').split(' ')[1]
          if (langName === 'plain' || langName === undefined) langName = 'Code'
          const highlightLangEle = `<div class="code-lang">${langName}</div>`
          createEle(highlightLangEle, item, 'hl')
        })
      }
    } else {
      if (isPrismjs) {
        $figureHighlight.forEach(function (item) {
          btf.wrap(item, 'figure', '', 'highlight')
          createEle('', item)
        })
      } else {
        $figureHighlight.forEach(function (item) {
          createEle('', item, 'hl')
        })
      }
    }
  }

  /**
 * PhotoFigcaption
 */
  function addPhotoFigcaption () {
    document.querySelectorAll('#article-container img').forEach(function (item) {
      const parentEle = item.parentNode
      if (!parentEle.parentNode.classList.contains('justified-gallery')) {
        const ele = document.createElement('div')
        ele.className = 'img-alt is-center'
        ele.textContent = item.getAttribute('alt')
        parentEle.insertBefore(ele, item.nextSibling)
      }
    })
  }

  /**
 * justified-gallery 圖庫排版
 * 需要 jQuery
 */

  let detectJgJsLoad = false
  const runJustifiedGallery = function (ele) {
    const $justifiedGallery = $(ele)
    const $imgList = $justifiedGallery.find('img')
    $imgList.unwrap()
    if ($imgList.length) {
      $imgList.each(function (i, o) {
        if ($(o).attr('data-lazy-src')) $(o).attr('src', $(o).attr('data-lazy-src'))
        $(o).wrap('<div></div>')
      })
    }

    if (detectJgJsLoad) btf.initJustifiedGallery($justifiedGallery)
    else {
      $('head').append(`<link rel="stylesheet" type="text/css" href="${GLOBAL_CONFIG.source.justifiedGallery.css}">`)
      $.getScript(`${GLOBAL_CONFIG.source.justifiedGallery.js}`, function () {
        btf.initJustifiedGallery($justifiedGallery)
      })
      detectJgJsLoad = true
    }
  }

  /**
 * fancybox和 mediumZoom
 */
  const addFancybox = function (ele) {
    const runFancybox = (ele) => {
      ele.each(function (i, o) {
        const $this = $(o)
        const lazyloadSrc = $this.attr('data-lazy-src') || $this.attr('src')
        const dataCaption = $this.attr('alt') || ''
        $this.wrap(`<a href="${lazyloadSrc}" data-fancybox="group" data-caption="${dataCaption}" class="fancybox"></a>`)
      })

      $().fancybox({
        selector: '[data-fancybox]',
        loop: true,
        transitionEffect: 'slide',
        protect: true,
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'close'],
        hash: false
      })
    }

    if (typeof $.fancybox === 'undefined') {
      $('head').append(`<link rel="stylesheet" type="text/css" href="${GLOBAL_CONFIG.source.fancybox.css}">`)
      $.getScript(`${GLOBAL_CONFIG.source.fancybox.js}`, function () {
        runFancybox($(ele))
      })
    } else {
      runFancybox($(ele))
    }
  }

  const addMediumZoom = () => {
    const zoom = mediumZoom(document.querySelectorAll('#article-container :not(a)>img'))
    zoom.on('open', e => {
      const photoBg = document.documentElement.getAttribute('data-theme') === 'dark' ? '#121212' : '#fff'
      zoom.update({
        background: photoBg
      })
    })
  }

  const jqLoadAndRun = () => {
    const $fancyboxEle = GLOBAL_CONFIG.lightbox === 'fancybox'
      ? document.querySelectorAll('#article-container :not(a):not(.gallery-group) > img, #article-container > img')
      : []
    const fbLengthNoZero = $fancyboxEle.length > 0
    const $jgEle = document.querySelectorAll('#article-container .justified-gallery')
    const jgLengthNoZero = $jgEle.length > 0

    if (jgLengthNoZero || fbLengthNoZero) {
      btf.isJqueryLoad(() => {
        jgLengthNoZero && runJustifiedGallery($jgEle)
        fbLengthNoZero && addFancybox($fancyboxEle)
      })
    }
  }

  /**
 * 滾動處理
 */
  const scrollFn = function () {
    const $rightside = document.getElementById('rightside')
    const innerHeight = window.innerHeight + 56

    // 當滾動條小于 56 的時候
    if (document.body.scrollHeight <= innerHeight) {
      $rightside.style.cssText = 'opacity: 1; transform: translateX(-38px)'
      return
    }

    let initTop = 0
    let isChatShow = true
    const $header = document.getElementById('page-header')
    const isChatBtnHide = typeof chatBtnHide === 'function'
    const isChatBtnShow = typeof chatBtnShow === 'function'
    window.addEventListener('scroll', btf.throttle(function (e) {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      const isDown = scrollDirection(currentTop)
      if (currentTop > 56) {
        if (isDown) {
          if ($header.classList.contains('nav-visible')) $header.classList.remove('nav-visible')
          if (isChatBtnShow && isChatShow === true) {
            chatBtnHide()
            isChatShow = false
          }
        } else {
          if (!$header.classList.contains('nav-visible')) $header.classList.add('nav-visible')
          if (isChatBtnHide && isChatShow === false) {
            chatBtnShow()
            isChatShow = true
          }
        }
        $header.classList.add('nav-fixed')
        if (window.getComputedStyle($rightside).getPropertyValue('opacity') === '0') {
          $rightside.style.cssText = 'opacity: 1; transform: translateX(-38px)'
        }
      } else {
        if (currentTop === 0) {
          $header.classList.remove('nav-fixed', 'nav-visible')
        }
        $rightside.style.cssText = "opacity: ''; transform: ''"
      }

      if (document.body.scrollHeight <= innerHeight) {
        $rightside.style.cssText = 'opacity: 1; transform: translateX(-38px)'
      }
    }, 200))

    // find the scroll direction
    function scrollDirection (currentTop) {
      const result = currentTop > initTop // true is down & false is up
      initTop = currentTop
      return result
    }
  }

  /**
 *  toc
 */
  const tocFn = function () {
    const $cardTocLayout = document.getElementById('card-toc')
    const $cardToc = $cardTocLayout.getElementsByClassName('toc-content')[0]
    const $tocLink = $cardToc.querySelectorAll('.toc-link')
    const $article = document.getElementById('article-container')

    // main of scroll
    window.tocScrollFn = function () {
      return btf.throttle(function () {
        const currentTop = window.scrollY || document.documentElement.scrollTop
        scrollPercent(currentTop)
        findHeadPosition(currentTop)
      }, 100)()
    }
    window.addEventListener('scroll', tocScrollFn)

    const scrollPercent = function (currentTop) {
      const docHeight = $article.clientHeight
      const winHeight = document.documentElement.clientHeight
      const headerHeight = $article.offsetTop
      const contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : (document.documentElement.scrollHeight - winHeight)
      const scrollPercent = (currentTop - headerHeight) / (contentMath)
      const scrollPercentRounded = Math.round(scrollPercent * 100)
      const percentage = (scrollPercentRounded > 100) ? 100 : (scrollPercentRounded <= 0) ? 0 : scrollPercentRounded
      $cardToc.setAttribute('progress-percentage', percentage)
    }

    // anchor
    const isAnchor = GLOBAL_CONFIG.isanchor
    const updateAnchor = function (anchor) {
      if (window.history.replaceState && anchor !== window.location.hash) {
        if (!anchor) anchor = location.pathname
        const title = GLOBAL_CONFIG_SITE.title
        window.history.replaceState({
          url: location.href,
          title: title
        }, title, anchor)
      }
    }

    const mobileToc = {
      open: () => {
        $cardTocLayout.style.cssText = 'animation: toc-open .3s; opacity: 1; right: 45px'
      },

      close: () => {
        $cardTocLayout.style.animation = 'toc-close .2s'
        setTimeout(() => {
          $cardTocLayout.style.cssText = "opacity:''; animation: ''; right: ''"
        }, 100)
      }
    }

    document.getElementById('mobile-toc-button').addEventListener('click', () => {
      if (window.getComputedStyle($cardTocLayout).getPropertyValue('opacity') === '0') mobileToc.open()
      else mobileToc.close()
    })

    // toc元素點擊
    $cardToc.addEventListener('click', (e) => {
      e.preventDefault()
      const $target = e.target.classList.contains('toc-link')
        ? e.target
        : e.target.parentElement
      btf.scrollToDest(btf.getEleTop(document.getElementById(decodeURI($target.getAttribute('href')).replace('#', ''))), 300)
      if (window.innerWidth < 900) {
        mobileToc.close()
      }
    })

    const autoScrollToc = function (item) {
      const activePosition = item.getBoundingClientRect().top
      const sidebarScrollTop = $cardToc.scrollTop
      if (activePosition > (document.documentElement.clientHeight - 100)) {
        $cardToc.scrollTop = sidebarScrollTop + 150
      }
      if (activePosition < 100) {
        $cardToc.scrollTop = sidebarScrollTop - 150
      }
    }

    // find head position & add active class
    const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
    let detectItem = ''
    const findHeadPosition = function (top) {
      if ($tocLink.length === 0 || top === 0) {
        return false
      }

      let currentId = ''
      let currentIndex = ''

      list.forEach(function (ele, index) {
        if (top > btf.getEleTop(ele) - 80) {
          currentId = '#' + encodeURI(ele.getAttribute('id'))
          currentIndex = index
        }
      })

      if (detectItem === currentIndex) return

      if (isAnchor) updateAnchor(currentId)

      if (currentId === '') {
        $cardToc.querySelectorAll('.active').forEach(i => { i.classList.remove('active') })
        detectItem = currentIndex
        return
      }

      detectItem = currentIndex

      $cardToc.querySelectorAll('.active').forEach(item => { item.classList.remove('active') })
      const currentActive = $tocLink[currentIndex]
      currentActive.classList.add('active')

      setTimeout(() => {
        autoScrollToc(currentActive)
      }, 0)

      let parent = currentActive.parentNode

      for (; !parent.matches('.toc'); parent = parent.parentNode) {
        if (parent.matches('li')) parent.classList.add('active')
      }
    }
  }

  /**
 * Rightside
 */
  const rightSideFn = {
    switchReadMode: () => { // read-mode
      const $body = document.body
      $body.classList.add('read-mode')
      const newEle = document.createElement('button')
      newEle.type = 'button'
      newEle.className = 'fas fa-sign-out-alt exit-readmode'
      $body.appendChild(newEle)

      function clickFn () {
        $body.classList.remove('read-mode')
        newEle.remove()
        newEle.removeEventListener('click', clickFn)
      }

      newEle.addEventListener('click', clickFn)
    },
    switchDarkMode: () => { // Switch Between Light And Dark Mode
      const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
      if (nowMode === 'light') {
        activateDarkMode()
        saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
      } else {
        activateLightMode()
        saveToLocal.set('theme', 'light', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
      }
      // handle some cases
      typeof utterancesTheme === 'function' && utterancesTheme()
      typeof FB === 'object' && window.loadFBComment()
      window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
    },
    showOrHideBtn: () => { // rightside 點擊設置 按鈕 展開
      document.getElementById('rightside-config-hide').classList.toggle('show')
    },
    scrollToTop: () => { // Back to top
      btf.scrollToDest(0, 500)
    },
    hideAsideBtn: () => { // Hide aside
      const $htmlDom = document.documentElement.classList
      $htmlDom.contains('hide-aside')
        ? saveToLocal.set('aside-status', 'show', 2)
        : saveToLocal.set('aside-status', 'hide', 2)
      $htmlDom.toggle('hide-aside')
    },

    adjustFontSize: (plus) => {
      const fontSizeVal = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--global-font-size'))
      let newValue = ''
      if (plus) {
        if (fontSizeVal >= 20) return
        newValue = fontSizeVal + 1
        document.documentElement.style.setProperty('--global-font-size', newValue + 'px')
        !document.getElementById('nav').classList.contains('hide-menu') && adjustMenu(true)
      } else {
        if (fontSizeVal <= 10) return
        newValue = fontSizeVal - 1
        document.documentElement.style.setProperty('--global-font-size', newValue + 'px')
        document.getElementById('nav').classList.contains('hide-menu') && adjustMenu(true)
      }

      saveToLocal.set('global-font-size', newValue, 2)
      // document.getElementById('font-text').innerText = newValue
    }
  }

  document.getElementById('rightside').addEventListener('click', function (e) {
    const $target = e.target.id || e.target.parentNode.id
    switch ($target) {
      case 'go-up':
        rightSideFn.scrollToTop()
        break
      case 'rightside_config':
        rightSideFn.showOrHideBtn()
        break
      case 'readmode':
        rightSideFn.switchReadMode()
        break
      case 'darkmode':
        rightSideFn.switchDarkMode()
        break
      case 'hide-aside-btn':
        rightSideFn.hideAsideBtn()
        break
      case 'font-plus':
        rightSideFn.adjustFontSize(true)
        break
      case 'font-minus':
        rightSideFn.adjustFontSize()
        break
      default:
        break
    }
  })

  /**
 * menu
 * 側邊欄sub-menu 展開/收縮
 * 解決menus在觸摸屏下，滑動屏幕menus_item_child不消失的問題（手機hover的bug)
 */
  const clickFnOfSubMenu = function () {
    document.querySelectorAll('#sidebar-menus .expand').forEach(function (e) {
      e.addEventListener('click', function () {
        this.classList.toggle('hide')
        const $dom = this.parentNode.nextElementSibling
        if (btf.isHidden($dom)) {
          $dom.style.display = 'block'
        } else {
          $dom.style.display = 'none'
        }
      })
    })

    window.addEventListener('touchmove', function (e) {
      const $menusChild = document.querySelectorAll('#nav .menus_item_child')
      $menusChild.forEach(item => {
        if (!btf.isHidden(item)) item.style.display = 'none'
      })
    })
  }

  /**
 * 複製時加上版權信息
 */
  const addCopyright = () => {
    const copyright = GLOBAL_CONFIG.copyright
    document.body.oncopy = (e) => {
      e.preventDefault()
      let textFont; const copyFont = window.getSelection(0).toString()
      if (copyFont.length > copyright.limitCount) {
        textFont = copyFont + '\n' + '\n' + '\n' +
        copyright.languages.author + '\n' +
        copyright.languages.link + window.location.href + '\n' +
        copyright.languages.source + '\n' +
        copyright.languages.info
      } else {
        textFont = copyFont
      }
      if (e.clipboardData) {
        return e.clipboardData.setData('text', textFont)
      } else {
        return window.clipboardData.setData('text', textFont)
      }
    }
  }

  /**
 * 網頁運行時間
 */
  const addRuntime = () => {
    const $runtimeCount = document.getElementById('runtimeshow')
    if ($runtimeCount) {
      const publishDate = $runtimeCount.getAttribute('data-publishDate')
      $runtimeCount.innerText = btf.diffDate(publishDate) + ' ' + GLOBAL_CONFIG.runtime
    }
  }

  /**
 * 最後一次更新時間
 */
  const addLastPushDate = () => {
    const $lastPushDateItem = document.getElementById('last-push-date')
    if ($lastPushDateItem) {
      const lastPushDate = $lastPushDateItem.getAttribute('data-lastPushDate')
      $lastPushDateItem.innerText = btf.diffDate(lastPushDate, true)
    }
  }

  /**
 * table overflow
 */
  const addTableWrap = function () {
    const $table = document.querySelectorAll('#article-container :not(.highlight) > table, #article-container > table')
    if ($table.length) {
      $table.forEach(item => {
        btf.wrap(item, 'div', '', 'table-wrap')
      })
    }
  }

  /**
 * tag-hide
 */
  const clickFnOfTagHide = function () {
    const $hideInline = document.querySelectorAll('#article-container .hide-button')
    if ($hideInline.length) {
      $hideInline.forEach(function (item) {
        item.addEventListener('click', function (e) {
          const $this = this
          const $hideContent = $this.nextElementSibling
          $this.classList.toggle('open')
          if ($this.classList.contains('open')) {
            if ($hideContent.querySelectorAll('.justified-gallery').length > 0) {
              btf.initJustifiedGallery($hideContent.querySelectorAll('.justified-gallery'))
            }
          }
        })
      })
    }
  }

  const tabsFn = {
    clickFnOfTabs: function () {
      document.querySelectorAll('#article-container .tab > button').forEach(function (item) {
        item.addEventListener('click', function (e) {
          const $this = this
          const $tabItem = $this.parentNode

          if (!$tabItem.classList.contains('active')) {
            const $tabContent = $tabItem.parentNode.nextElementSibling
            const $siblings = btf.siblings($tabItem, '.active')[0]
            $siblings && $siblings.classList.remove('active')
            $tabItem.classList.add('active')
            const tabId = $this.getAttribute('data-href').replace('#', '')
            const childList = [...$tabContent.children]
            childList.forEach(item => {
              if (item.id === tabId) item.classList.add('active')
              else item.classList.remove('active')
            })
            const $isTabJustifiedGallery = $tabContent.querySelectorAll(`#${tabId} .justified-gallery`)
            if ($isTabJustifiedGallery.length > 0) {
              btf.initJustifiedGallery($isTabJustifiedGallery)
            }
          }
        })
      })
    },
    backToTop: () => {
      document.querySelectorAll('#article-container .tabs .tab-to-top').forEach(function (item) {
        item.addEventListener('click', function () {
          btf.scrollToDest(btf.getEleTop(btf.getParents(this, '.tabs')), 300)
        })
      })
    }
  }

  const toggleCardCategory = function () {
    const $cardCategory = document.querySelectorAll('#aside-cat-list .card-category-list-item.parent i')
    if ($cardCategory.length) {
      $cardCategory.forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault()
          const $this = this
          $this.classList.toggle('expand')
          const $parentEle = $this.parentNode.nextElementSibling
          if (btf.isHidden($parentEle)) {
            $parentEle.style.display = 'block'
          } else {
            $parentEle.style.display = 'none'
          }
        })
      })
    }
  }

  const switchComments = function () {
    let switchDone = false
    const $switchBtn = document.querySelector('#comment-switch > .switch-btn')
    $switchBtn && $switchBtn.addEventListener('click', function () {
      this.classList.toggle('move')
      document.querySelectorAll('#post-comment > .comment-wrap > div').forEach(function (item) {
        if (btf.isHidden(item)) {
          item.style.cssText = 'display: block;animation: tabshow .5s'
        } else {
          item.style.cssText = "display: none;animation: ''"
        }
      })

      if (!switchDone && typeof loadOtherComment === 'function') {
        switchDone = true
        loadOtherComment()
      }
    })
  }

  const addPostOutdateNotice = function () {
    const data = GLOBAL_CONFIG.noticeOutdate
    const diffDay = btf.diffDate(GLOBAL_CONFIG_SITE.postUpdate)
    if (diffDay >= data.limitDay) {
      const ele = document.createElement('div')
      ele.className = 'post-outdate-notice'
      ele.textContent = data.messagePrev + ' ' + diffDay + ' ' + data.messageNext
      const $targetEle = document.getElementById('article-container')
      if (data.position === 'top') {
        $targetEle.insertBefore(ele, $targetEle.firstChild)
      } else {
        $targetEle.appendChild(ele)
      }
    }
  }

  const lazyloadImg = () => {
    window.lazyLoadInstance = new LazyLoad({
      elements_selector: 'img',
      threshold: 0,
      data_src: 'lazy-src'
    })
  }

  const relativeDate = function (selector) {
    selector.forEach(item => {
      const $this = item
      const timeVal = $this.getAttribute('datetime')
      $this.innerText = btf.diffDate(timeVal, true)
      $this.style.display = 'inline'
    })
  }

  const unRefreshFn = function () {
    window.addEventListener('resize', adjustMenu)
    window.addEventListener('orientationchange', () => { setTimeout(adjustMenu(true), 100) })

    clickFnOfSubMenu()
    GLOBAL_CONFIG.islazyload && lazyloadImg()
    GLOBAL_CONFIG.copyright !== undefined && addCopyright()
  }

  window.refreshFn = function () {
    initAdjust()

    if (GLOBAL_CONFIG_SITE.isPost) {
      GLOBAL_CONFIG_SITE.isToc && tocFn()
      GLOBAL_CONFIG.noticeOutdate !== undefined && addPostOutdateNotice()
      GLOBAL_CONFIG.relativeDate.post && relativeDate(document.querySelectorAll('#post-meta time'))
    } else {
      GLOBAL_CONFIG.relativeDate.homepage && relativeDate(document.querySelectorAll('#recent-posts time'))
      GLOBAL_CONFIG.runtime && addRuntime()
      addLastPushDate()
      toggleCardCategory()
    }

    sidebarFn()
    GLOBAL_CONFIG_SITE.isHome && scrollDownInIndex()
    addHighlightTool()
    GLOBAL_CONFIG.isPhotoFigcaption && addPhotoFigcaption()
    jqLoadAndRun()
    GLOBAL_CONFIG.lightbox === 'mediumZoom' && addMediumZoom()
    scrollFn()
    addTableWrap()
    clickFnOfTagHide()
    tabsFn.clickFnOfTabs()
    tabsFn.backToTop()
    switchComments()
  }

  refreshFn()
  unRefreshFn()
})
