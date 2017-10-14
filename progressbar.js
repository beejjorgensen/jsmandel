class ProgressBar {
	constructor(peer, percent=0) {
		this.peer = peer;
		this.inner = peer.querySelector('.progress-bar-inner');

		this.setPercent(percent);
	}

	setPercent(percent) {
		this.percent = percent;

		this.render();
	}

	render() {
		this.inner.style.width = this.percent + '%';
	}
}