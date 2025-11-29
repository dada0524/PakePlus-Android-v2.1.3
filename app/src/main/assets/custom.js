window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

const hookClick = (e) => {
    const origin = e.target.closest('a');
    
    if (origin && origin.href) {
        const url = origin.href;
        // 步骤1: 判断是否为下载链接
        // 假设下载链接的URL中包含特定的文件扩展名，如 .zip
        if (url.endsWith('.zip') || url.endsWith('.apk') || origin.hasAttribute('download')) {
            e.preventDefault(); // 阻止默认的链接跳转行为
            
            // 步骤2: 调用 PakePlus 提供的下载 API
            // 注意：具体的API名称和用法需要查阅最新的 PakePlus 文档
            // 以下是假设的调用方式
            if (window.pakeplus && window.pakeplus.downloadFile) {
                window.pakeplus.downloadFile(url, (progress) => {
                    console.log(`下载进度：${progress}%`);
                }, (success) => {
                    console.log('文件下载完成:', success);
                    // 下载完成后可以给用户一个提示
                    alert('文件下载完成！');
                }, (error) => {
                    console.error('文件下载失败:', error);
                    alert('文件下载失败！');
                });
            } else {
                console.log('PakePlus下载API不可用，使用默认行为');
                // PakePlus下载API不可用时的回退方案
                location.href = url;
            }
            return; // 结束函数，不再执行后面的代码
        }
    }

    // PakePlus自带的链接处理逻辑（处理新窗口链接）
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');
    if ((origin && origin.href && origin.target === '_blank') || (origin && origin.href && isBaseTargetBlank)) {
        e.preventDefault();
        location.href = origin.href;
    }
}

// 保持原有的 window.open 重写，这不会影响文件下载
window.open = function (url, target, features) {
    location.href = url;
}

document.addEventListener('click', hookClick, { capture: true });

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
