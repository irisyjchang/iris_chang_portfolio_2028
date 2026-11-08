class WechatAccessibilityDemo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="wechat-demo-intro">
        <span>Interactive concept</span>
        <strong>Follow the conversation</strong>
        <p>Step into my family’s WeChat group. Tap the voice message, send a sample reply, then try captions in a simulated call.</p>
      </div>
      <fieldset class="wechat-settings">
        <legend>Accessibility settings</legend>
        <label><input type="checkbox" data-transcripts checked> Automatic voice transcripts</label>
        <label><input type="checkbox" data-easy> Easy Mode <small>Larger conversation text</small></label>
      </fieldset>
      <div class="wechat-demo-grid">
        <div class="pk-int-phone wechat-phone">
          <div class="pk-int-screen wechat-chat" aria-labelledby="wechat-chat-heading">
            <div class="wechat-screen-heading">
              <span>01 · Family group chat</span>
              <strong id="wechat-chat-heading" lang="zh-Hans">家（12）</strong>
            </div>
            <div class="wechat-thread">
              <div class="wechat-message-group">
                <img class="wechat-avatar" src="images/wechat-family-voice-avatar.png" width="39" height="40" alt="">
                <div>
                  <button type="button" class="wechat-voice" data-transcript-button aria-controls="wechat-sample-transcript">
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true"><path d="M3 12h2m3-3a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12m3-15a13 13 0 0 1 0 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
                    <span>6″</span>
                  </button>
                  <div class="wechat-transcript" id="wechat-sample-transcript" data-transcript>
                    <strong>Automatic transcript</strong>
                    <span lang="zh-Hans">周日中午一起吃饭，十二点在老地方见。</span>
                  </div>
                </div>
              </div>
              <div class="wechat-message-group">
                <img class="wechat-avatar" src="images/wechat-family-meal-avatar.png" width="39" height="40" alt="">
                <img class="wechat-meal" src="images/wechat-family-meal.png" width="86" height="155" alt="A plate of food shared in the original family chat">
              </div>
              <div class="wechat-reply-thread" aria-live="polite">
                <div class="wechat-reply" data-reply hidden><small>You</small><span lang="zh-Hans">好呀，周日见！</span></div>
              </div>
            </div>
            <div class="wechat-screen-foot">
              <button type="button" class="wechat-button wechat-send" data-send aria-label="Send sample reply">
                <span lang="zh-Hans">好呀，周日见！</span><span aria-hidden="true">Send ↑</span>
              </button>
            </div>
          </div>
        </div>
        <div class="wechat-screen wechat-call" aria-labelledby="wechat-call-heading">
          <div class="wechat-screen-heading">
            <span>02 · Video calls</span>
            <strong id="wechat-call-heading">Call with Mei</strong>
          </div>
          <div class="wechat-call-stage">
            <span class="wechat-call-avatar" aria-hidden="true">M</span>
            <div class="wechat-caption" lang="zh-Hans" aria-live="polite" aria-atomic="true"></div>
          </div>
          <div class="wechat-screen-foot wechat-call-controls">
            <button type="button" class="wechat-button" data-play>Play sample call</button>
            <button type="button" class="wechat-button wechat-cc" data-cc aria-pressed="false" aria-label="Live captions"><span aria-hidden="true">CC</span><span data-cc-state aria-hidden="true">Off</span></button>
          </div>
        </div>
      </div>
      <p class="wechat-demo-note">The chat uses photos from my family’s group. Replies and call captions are simulated.</p>
    `;

    const automatic = this.querySelector("[data-transcripts]");
    const easyMode = this.querySelector("[data-easy]");
    const transcript = this.querySelector("[data-transcript]");
    const transcriptButton = this.querySelector("[data-transcript-button]");
    const reply = this.querySelector("[data-reply]");
    const send = this.querySelector("[data-send]");

    const showTranscript = (show) => {
      transcript.hidden = !show;
      transcriptButton.setAttribute("aria-label", show ? "Voice message, 6 seconds. Hide transcript" : "Voice message, 6 seconds. Show transcript");
      transcriptButton.setAttribute("aria-expanded", String(show));
    };

    showTranscript(automatic.checked);
    automatic.addEventListener("change", () => showTranscript(automatic.checked));
    easyMode.addEventListener("change", () => this.classList.toggle("is-easy", easyMode.checked));
    transcriptButton.addEventListener("click", () => showTranscript(transcript.hidden));
    send.addEventListener("click", () => {
      reply.hidden = false;
      send.disabled = true;
      send.textContent = "Sample reply sent";
      const thread = this.querySelector(".wechat-thread");
      thread.scrollTop = thread.scrollHeight;
    });

    const captions = [
      "我们周日中午见，",
      "十二点在老地方。"
    ];
    const play = this.querySelector("[data-play]");
    const cc = this.querySelector("[data-cc]");
    const ccState = this.querySelector("[data-cc-state]");
    const caption = this.querySelector(".wechat-caption");
    let captionsOn = false;
    let playing = false;
    let line = -1;

    const renderCaption = () => {
      const status = line < 0 ? "字幕将在此显示。" : "通话已结束。";
      caption.textContent = captionsOn ? (captions[line] ?? status) : "";
    };

    const nextCaption = () => {
      line += 1;
      renderCaption();
      if (line < captions.length) {
        this.captionTimer = setTimeout(nextCaption, 3300);
      } else {
        playing = false;
        play.textContent = "Replay sample call";
      }
    };

    play.addEventListener("click", () => {
      if (playing) {
        clearTimeout(this.captionTimer);
        playing = false;
        play.textContent = "Resume sample call";
        return;
      }
      if (line >= captions.length) line = -1;
      playing = true;
      play.textContent = "Pause sample call";
      nextCaption();
    });

    cc.addEventListener("click", () => {
      captionsOn = !captionsOn;
      cc.setAttribute("aria-pressed", String(captionsOn));
      ccState.textContent = captionsOn ? "On" : "Off";
      renderCaption();
    });
  }

  disconnectedCallback() {
    clearTimeout(this.captionTimer);
  }
}

customElements.define("wechat-accessibility-demo", WechatAccessibilityDemo);
