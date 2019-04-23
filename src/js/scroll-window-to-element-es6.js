export class ScrollToElement {

    defaults = {
        anchors: 'a[href*="#"]',
        duration: 350,
        offset: 0,
        easing: 'easeInOut',
        dataAttrName: 'section',
        init: true,
    };

    constructor(opts) {
        this.opts = Object.assign(defaults, (opts || {}));
        if (this.opts.init) this.init();
    }

    // Animation function with requestAnimationFrame()
    animate(draw, duration) {
        const start = performance.now();
        requestAnimationFrame(function _animate(time) {
            let timePassed = time - start;
            if (timePassed > duration) timePassed = duration;
            draw(timePassed);
            if (timePassed < duration) requestAnimationFrame(_animate);
        });
    };

    init() {
        const anchorsArr = [].slice.call(document.querySelectorAll(this.opts.anchors));
        anchorsArr.forEach(a => a.addEventListener('click', e => this.clickHandler(e)));
    }

    makeEaseInOut(timing, progress) {
        return () => {
            if (progress < 0.5) {
                return timing(2 * progress) / 2;
            } else { return (2 - timing(2 * (1 - progress))) / 2; }
        };
    }

    timingFn(progress, startVal, displace) {
        if (this.easing === 'linear') {
            return (progress * displace) + startVal;
        } else {
            const easeInOut = this.makeEaseInOut(function (prgrs) { return Math.pow(prgrs, 2); }, progress);
            return (easeInOut() * displace) + startVal;
        }
    }

    clickHandler(e) {
        if (e) { e.preventDefault(); }

        const link = e.currentTarget.getAttribute('href'),
            elToScroll = document.querySelector(link) || document.querySelector('*[data-' + this.opts.dataAttrName + '="' + link.substr(1) + '"]'),
            offsetTop = this.elOffsetTop(elToScroll);

        const startVal = window.pageYOffset,
            endVal = offsetTop + this.opts.offset,
            displace = endVal - startVal,
            duration = this.opts.duration;

        if (displace === 0) return;

        animate(timePassed => {
            let progress = timePassed / duration,
                newVal = timingFn(progress, startVal, displace);
            window.scrollTo(null, newVal);
        }, duration);

    }

    elOffsetTop(el) {
        let top = 0;
        while (el.parentNode) {
            top += el.offsetTop;
            el = el.parentNode;
        }
        return top;
    }
}
