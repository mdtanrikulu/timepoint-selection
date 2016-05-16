import moment from 'moment';
import 'moment-duration-format';

let units = [
    {start: 0, end: 1, increment: 36000},
    {start: 1, end: 2, increment: 3600},
    {start: 3, end: 4, increment: 600},
    {start: 4, end: 5, increment: 60},
    {start: 6, end: 7, increment: 10},
    {start: 7, end: 8, increment: 1}
];

let formatSelectionPoints = {
    'hh:mm:ss': [0, 1, 1, 2, 3, 3, 4, 5, 5]
};

const MAX = 3600 * 99 + 60 * 59 + 1 * 59;

const KEYLEFT = 37;
const KEYUP = 38;
const KEYRIGHT = 39;
const KEYDOWN = 40;


export default class Selection {
    constructor(el, options) {
        this.durationFormat = 'hh:mm:ss';
        this.value = 0;
        this.index = undefined;
        this.el = el;

        this.init();
    }

    formatDuration(duration) {
        return moment.duration(duration, 'seconds').format(this.durationFormat, {trim: false});
    }

    setSelection(input) {
        setTimeout(() => {
            let data = units[this.index];
            input.setSelectionRange(data.start, data.end);
        }, 0);
    }

    init() {
        this.el.value = this.formatDuration(this.value);

        this.el.addEventListener("click", (e) => {
            e.preventDefault();

            let input = e.target;
            let index = formatSelectionPoints[this.durationFormat][input.selectionStart];
            let data = units[index];

            this.setSelection(e.target, data.start, data.end);
            this.index = index;
        });

        this.el.addEventListener("keydown", (e) => {
            e.preventDefault();
        });

        this.el.addEventListener("keyup", (e) => {
            e.preventDefault();

            let input = e.target;
            let data = units[this.index]

            switch(e.which) {
                case KEYUP:
                    if ((this.value + data.increment) > MAX) {
                        this.value = this.value - MAX + data.increment - 1;
                    }
                    else {
                        this.value += data.increment;
                    }
                    input.value = this.formatDuration(this.value);
                    break;
                case KEYDOWN:
                    
                    if ((this.value - data.increment) < 0) {
                        this.value = this.value + MAX - data.increment + 1;
                    }
                    else {
                        this.value -= data.increment; 
                    }
                    input.value = this.formatDuration(this.value);
                    break;
                case KEYLEFT:
                    this.index -= 1;
                    break;
                case KEYRIGHT:
                    this.index += 1;
                    break;
            }

            this.setSelection(input);
        });
    }
}

export default function(el, options={}) {

    return new Selection(el, options);
}