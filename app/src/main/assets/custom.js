window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
// --- 修改后的 PakePlus 注入脚本 ---

const hookClick = (e) => {
    const origin = e.target.closest('a')
    
    // 1. 如果没有链接，直接忽略
    if (!origin || !origin.href) return;

    // 【核心修改点 A】
    // 原代码在这里拦截了 _blank 并强制在 App 内打开，导致无法下载。
    // 修改为：如果是 target="_blank"，直接 return，不做任何拦截！
    // 这样 PakePlus 底层就会接管它，并调用手机系统浏览器打开（从而触发下载）。
    if (origin.target === '_blank') {
        console.log('检测到外部链接/下载请求，放行给系统浏览器:', origin.href);
        return; 
    }

    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]')
    
    // 2. 只有当确实需要拦截时（比如非 _blank 的普通跳转），才执行原来的逻辑
    // 这里保留原逻辑的结构，防止破坏单页应用(SPA)的路由
    if (isBaseTargetBlank) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    }
}

// 【核心修改点 B】
// 重写 window.open。
// 既然你要“直接下载”，我们就不做文件后缀判断了。
// 任何调用 window.open 的行为，都视为“要在外部浏览器打开”。
window.open = function (url, target, features) {
    console.log('window.open 被调用，强制转换为系统浏览器下载:', url);
    
    // 创建一个临时的 a 标签
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank'; // 设置为 _blank，配合上面的 hookClick 放行逻辑
    
    document.body.appendChild(a);
    a.click(); // 模拟点击，触发系统浏览器
    
    // 延时清理
    setTimeout(() => {
        document.body.removeChild(a);
    }, 100);
}

// 注册监听器
document.addEventListener('click', hookClick, { capture: true })

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })


