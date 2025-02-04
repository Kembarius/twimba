import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

tweetsData.forEach(tweet => {
        tweet.isRepliesVisible = false;
        tweet.profilePic = `public/${tweet.profilePic}`
        tweet.replies.forEach(reply => {
            reply.profilePic = `public/${reply.profilePic}`
        })
    })
console.log(tweetsData)

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.replybtn) {
        handleReplyBtn(e.target.dataset.replybtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    
    const targetTweet = tweetsData.find(tweet => tweet.uuid === replyId);
    
    targetTweet.isRepliesVisible = !targetTweet.isRepliesVisible;
    render();
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `public/images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleReplyBtn(replyId) {
    const replyInput = document.getElementById(`input-${replyId}`)
    
    if(replyInput.value){
        const targetTweetObjectReplies = tweetsData.filter(function(tweet){
            return tweet.uuid === replyId
        })[0].replies
        
        targetTweetObjectReplies.unshift({
                handle: `@Scrimba`,
                profilePic: `public/images/scrimbalogo.png`,
                tweetText: replyInput.value,
            })
        render()
        replyInput.value = ''
    }
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        const repliesClass = tweet.isRepliesVisible ? '' : 'hidden';
        
        const likeIconClass = tweet.isLiked ? 'liked': ''
    
        const retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                            <div class="tweet-reply">
                                <div class="tweet-inner">
                                    <img src="${reply.profilePic}" class="profile-pic">
                                        <div>
                                            <p class="handle">${reply.handle}</p>
                                            <p class="tweet-text">${reply.tweetText}</p>
                                        </div>
                                    </div>
                            </div>
                            `
            })
        }
        
          
        feedHtml += `
                    <div class="tweet">
                        <div class="tweet-inner">
                            <img src="${tweet.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${tweet.handle}</p>
                                <p class="tweet-text">${tweet.tweetText}</p>
                                <div class="tweet-details">
                                    <span class="tweet-detail">
                                        <i class="fa-regular fa-comment-dots"
                                        data-reply="${tweet.uuid}"
                                        ></i>
                                        ${tweet.replies.length}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-heart ${likeIconClass}"
                                        data-like="${tweet.uuid}"
                                        ></i>
                                        ${tweet.likes}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                                        data-retweet="${tweet.uuid}"
                                        ></i>
                                        ${tweet.retweets}
                                    </span>
                                </div>   
                            </div>            
                        </div>
                        <div class="tweet-reply ${repliesClass}" id="reply-${tweet.uuid}">
                            <div class="tweet-inner">
                            <img src="public/images/scrimbalogo.png" class="profile-pic">
                                <div class="reply-inner">
                                    <textarea placeholder="Post your reply" id="input-${tweet.uuid}"></textarea>
                                    <button id="reply-btn" data-replybtn="${tweet.uuid}">Reply</button>
                                </div>
                            </div>    
                        </div>
                        <div class="${repliesClass}" id="replies-${tweet.uuid}">
                            ${repliesHtml}
                        </div>   
                    </div>
                    `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

