class WechatAccessibilityDemo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="wechat-demo-intro">
        <span>Interactive concept</span>
        <strong>Follow the conversation</strong>
        <p>Read a sample voice message, then try captions in a simulated video call.</p>
      </div>
      <fieldset class="wechat-settings">
        <legend>Accessibility settings</legend>
        <label><input type="checkbox" data-transcripts checked> Automatic voice transcripts</label>
        <label><input type="checkbox" data-easy> Easy Mode <small>Larger conversation text</small></label>
      </fieldset>
      <div class="wechat-demo-grid">
        <div class="wechat-screen wechat-chat" aria-labelledby="wechat-chat-heading">
          <div class="wechat-screen-heading">
            <span>01 · Voice messages</span>
            <strong id="wechat-chat-heading">Family chat</strong>
          </div>
          <div class="wechat-thread">
            <span class="wechat-timestamp">Today · 3:42 PM</span>
            <div class="wechat-message wechat-message-sent" lang="zh-Hans">周日还一起吃饭吗？</div>
            <div class="wechat-message-group">
              <span class="wechat-avatar" aria-hidden="true">M</span>
              <div>
                <strong class="wechat-speaker">Mei</strong>
                <div class="wechat-message wechat-voice">
                  <svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><path d="M3 10v4m7-8v12m7-16v20m7-16v12m7-9v6m6-4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Voice message <span>0:08</span>
                </div>
                <div class="wechat-transcript" data-transcript>
                  <strong>Automatic transcript</strong>
                  <span lang="zh-Hans">周日中午一起吃饭，十二点在老地方见。</span>
                </div>
              </div>
            </div>
          </div>
          <div class="wechat-screen-foot">
            <button type="button" class="wechat-button" data-transcript-button aria-controls="wechat-sample-transcript">Hide transcript</button>
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
      <p class="wechat-demo-note">Scripted demo with sample dialogue and captions.</p>
    `;

    const automatic = this.querySelector("[data-transcripts]");
    const easyMode = this.querySelector("[data-easy]");
    const transcript = this.querySelector("[data-transcript]");
    const transcriptButton = this.querySelector("[data-transcript-button]");
    transcript.id = "wechat-sample-transcript";

    const showTranscript = (show) => {
      transcript.hidden = !show;
      transcriptButton.textContent = show ? "Hide transcript" : "Show transcript";
      transcriptButton.setAttribute("aria-expanded", String(show));
    };

    showTranscript(automatic.checked);
    automatic.addEventListener("change", () => showTranscript(automatic.checked));
    easyMode.addEventListener("change", () => this.classList.toggle("is-easy", easyMode.checked));
    transcriptButton.addEventListener("click", () => showTranscript(transcript.hidden));

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
