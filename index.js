const data = {
    messages: [{
            left: '你好啊！',
            right: [{
                text: '别墨迹啦快开始吧！',
                score: 0
            }]
        }, {
            left: '那~ 我喝酸奶舔不舔酸奶盖？',
            right: [{
                text: '从来不舔',
                score: 0
            }, {
                text: '有时候舔',
                score: 2
            }, {
                text: '每次都舔',
                score: 3
            }]
        },
        {
            left: '以下愿望我最想实现哪个？',
            right: [{
                text: '找到对象',
                score: -30
            }, {
                text: '找到工作',
                score: 2
            }, {
                text: '家人健康',
                score: 3
            }]
        },
        {
            left: '我喜欢几个人去旅行？',
            right: [{
                text: '三五好友',
                score: 0
            }, {
                text: '两个人',
                score: 2
            }, {
                text: '独自旅行',
                score: 3
            }]

        },
        {
            left: '如果有时光机，我想去哪儿？',
            right: [{
                text: '过去',
                score: 0
            }, {
                text: '未来',
                score: 2
            }, {
                text: '哪儿都不去，万一回不来了呢(◕ᴗ◕)',
                score: 3
            }]
        }
    ],
    result: [{
            score: 10,
            tips: '你这么懂我，为什么还不娶我。',
            say: '哇塞'
        },
        {

            score: 6,
            tips: '虽然不是很熟，最起码你路过过我的青春。',
            say: '挺好的'
        },
        {
            score: 0,
            tips: '可能我们只适合做路人。',
            say: '啊噫~'
        },
        {
            score: -30,
            tips: '不好意思，既然你觉得我想找对象，这中间一定有什么误会',
            say: 'emmm...'
        }
    ]
}


/* util */
/**
 * @description 传入模板，返回dom
 * @param {String} tpl 模板字符串
 */
function createDom(tpl) {
    const div = document.createElement('div');
    div.innerHTML = tpl;
    return div.children[0];
}

function $(selector) {
    return document.querySelector(selector);
}

function addClass(element, className) {
    element.classList.add(className);
}

function removeClass(element, className) {
    element.classList.remove(className);
}

function hasClass(element, className) {
    return element.classList.contains(className);
}


const continueBtn = $('.js-continue');
const chatList = $('.chat-list');
const msgSelector = $('.message-select');
const chatPage = $('.chat-page');
const tips = $('.cover-tips ');


function bindEvents() {
    continueBtn.addEventListener('touchend', () => {
        const firstPage = $('.first-page');
        addClass(firstPage, 'fadeout');
        setTimeout(() => {
            addClass(firstPage, 'hide');
            oneStep(0);
        }, 650)
    })

    // 事件委托??
    msgSelector.addEventListener('touchend', (event) => {
        let target = event.target
        const currentTarget = event.currentTarget
        while (target !== currentTarget) {
            if (hasClass(target, 'js-to-select')) {
                const currentScore = +target.getAttribute('data-score')
                const message = target.querySelector('.message-bubble').innerText
                appendMessage('right', message);
                score += currentScore;
                nextStep()
                return
            }
            target = target.parentNode
        }
    })

    $('.icon-replay').addEventListener('touchend', (event) => {
        window.location.reload()
    })
}

let step = 0;
let score = 0;
const MAX_STEP = data.messages.length;

function getMessageStr(side, str) {
    return `
    <div class="message-item message-item--${side}">
      <img class="avatar" src="./img/${side === 'left' ? 'girl' : 'boy'}.png" alt="头像">
      <div class="message-bubble">${str}</div>
    </div>
  `
}

function getSelectorStr(messageObj) {
    return `
    <div class="message-item message-item--right js-to-select" data-score=${messageObj.score}>
      <img class="avatar" src="./img/boy.png" alt="头像">
      <div class="message-bubble">${messageObj.text}</div>
    </div>
  `
}

function createMessage(side, str) {
    return createDom(messageStr);
}

function appendMessage(side, str) {
    const messageStr = getMessageStr(side, str);
    const messageDom = createDom(messageStr);
    chatList.appendChild(messageDom);
}

function changeSelectList(step) {
    const currentMsg = data.messages[step];
    selectListStr = '';
    currentMsg.right.forEach((selectMessage) => {
        selectListStr += getSelectorStr(selectMessage);
    })
    msgSelector.innerHTML = selectListStr;
}

function toggleSelector(isShow) {
    if (isShow) {
        addClass(chatPage, 'show-selector');
    } else {
        removeClass(chatPage, 'show-selector');
    }
}

function oneStep(step) {
    const currentMsg = data.messages[step];
    appendMessage('left', currentMsg.left);
    setTimeout(() => {
        changeSelectList(step);
        toggleSelector(true);
    }, 600)
}

function showTips(resultObj) {
    tips.querySelector('.tips-text').innerText = `分数：${score}
      ${resultObj.tips}`
    removeClass(tips, 'hide')
}

function showResult() {
    setTimeout(() => {
        // 显示左边最后的对话say
        const resultObj = getResultByScore(score)
        appendMessage('left', resultObj.say)
            // 显示结果窗口
        setTimeout(() => {
            showTips(resultObj)
        }, 1500)
    }, 1500)
}

// 根据分区间获取结果对话对象
function getResultByScore(score) {
    const resultMsg = data.result
    let result;
    resultMsg.every((resultObj) => {
        if (score >= resultObj.score) {
            result = resultObj
            return false
        }
        return true
    })
    return result
}

function nextStep() {
    step += 1;
    toggleSelector(false);
    if (step < MAX_STEP) {
        setTimeout(() => {
            oneStep(step);
        }, 500)
    } else {
        showResult();
    }
}

bindEvents();