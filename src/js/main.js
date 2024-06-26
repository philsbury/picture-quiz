import Alpine from "alpinejs";
import { random } from "gsap";

const { timer } = window;

global.game = () => ({
    // https://placehold.co/600x400/orange/white
    data: [],
    current: 0,
    initialised: false,
    loop: false,
    revealed: false,
    showScore: false,
    score: {
        w: 0,
        s: 0,
    },
    timer: timer,
    timeout: null,
    ended: false,
    async init() {
        const { json } = window;

        const data = await(
            await(
                fetch(`/dist/data/${json || 'images1.json'}`)
            )
        ).json()

        this.data = data;
        this.initialised = true;

    },
    start(key) {

    },
    updateScore(who) {
        this.score[who] = this.score[who] + 1;
        this.reveal();
    },
    tick() {
        if (this.timer > 0) {

            this.timer = this.timer - 1;

            this.timeout = setTimeout(() => this.tick(), 1000);
        } else {
            this.choose()
        }
    },
    choose() {
        const panels = Array.from(document.querySelectorAll('.panel:not([data-chosen]'));

        let loop = Math.ceil(this.data[this.current].grid * 6);

        loop = Math.min(loop, 20);
        const max = loop;


        while(loop > 0) {
            const num = this.getRandomInt(panels.length - 1);
            const count = loop;

            setTimeout(() => {
                panels[num].style.backgroundColor = 'white';

                setTimeout(() => {
                    panels[num].style.backgroundColor = '';

                    if (max === count) {
                        this.pick();

                        this.timer = timer + 1;

                        this.tick();
                    }
                }, 100);
            }, 100 * loop);
            // setTimeout()


            loop--;
        }
    },
    pick() {
        const panels = Array.from(document.querySelectorAll('.panel:not([data-chosen]'));
        const num = this.getRandomInt(panels.length - 1);

        panels[num].setAttribute('data-chosen', true);

        if (!panels.length) {
            this.revealed = true;
        }

        // if (!Array.from(document.querySelectorAll('.panel:not([data-chosen]')).length) {
        //     this.name();
        // }
    },
    reveal() {
        clearTimeout(this.timeout);
        Array.from(document.querySelectorAll('.panel:not([data-chosen]')).forEach(el => el.setAttribute('data-chosen', true))
        setTimeout(() => {
            this.name();
            this.showScore = true;
        }, 501);
    },
    name() {
        const name = document.createElement('p');
        name.textContent = this.data[this.current].answer;
        name.classList.add(
            'answer', 'absolute', 'z-20', 'p-2', 'text-4xl', 'font-bold', 'text-green-500', 'scale-[20]', 'drop-shadow-lg', '-rotate-12', 'uppercase', 'transition-all', 'border-4', 'border-green-500', 'border-solid', 'bottom-6', 'right-6', 'opacity-0', 'rounded-xl', 'bg-black'
        );
        document.body.appendChild(name);

        setTimeout(() => {
            name.classList.remove('scale-[20]', '-rotate-12', 'opacity-0');
            name.classList.add('scale-1', '-rotate-0', 'opacity-100');
            this.revealed = true;

        }, 500);
    },
    next() {
        this.initialised = false;
        this.revealed = false;


        const answer = document.querySelector('.answer');

        if (answer) {
            answer.parentNode.removeChild(answer);
        }

        Array.from(document.querySelectorAll('[data-chosen]')).forEach(el => el.removeAttribute('data-chosen', true))
        this.current = this.current + 1;

        if (undefined === this.data[this.current]) {
            this.ended = true;
            return;
        }
        setTimeout(() => {
            this.initialised = true;
            this.showScore = false;
        }, 1000);
    },
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

})

Alpine.start();