<template>
    <div class="canvas">
        <div class="sky"></div>
        <div class="bee">
            <div :class="['box', {'show': boxShow}, {'big': boxBig}]">{{ this.boxString }}</div>
            <div class="body">
                <div class="line"></div>
                <div class="line line--2"></div>
                <div class="sting"></div>
            </div>
            <div :class="['face', {'face--talking': talking}, {'face--smile': smile}, {'face--sad': sad}]">
                <div class="eye1"></div>
                <div class="eye2"></div>
                <div class="mounth">
                    <div class="tooth"></div>
                </div>
            </div>
            <div class="wings">
                <div class="wing"></div>
                <div class="wing-2"></div>
            </div>
        </div>
        <div class="moving">
            <div class="bushes">
                <div class="cloud"></div>
                <div class="cloud cloud--2"></div>
                <div class="obj">
                    <div class="bush"></div>
                </div>
                <div class="obj">
                    <div class="flower"><span></span></div>
                </div>
                <div class="obj">
                    <div class="bush bush--2"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                steps: [],
                currentStep: 0,
                currentNumber: 0,
                count: 0,
                interval: null,
                boxString: '',
                boxBig: false,
                boxShow: false,
                sad: false,
                smile: false,
                talking: false,
                stepEnd: 0,
                firstPartQuotes: [
                    '欢迎您使用后台管理系统！',
                    '使用愉快！'
                ]
            }
        },
        methods: {
            getUserInfo(){
                this.$ajax({
                    method: 'post',
                    url:  '/admin/user/getinfo'
                }).then( (res)=> {
                }).catch( (res)=> { });
            },
            generateQuote(list) {
                let time = this.stepEnd;
                list.forEach((quote, i) => {
                    this.steps.push({
                        big: false,
                        sentence: quote,
                        start: time,
                        end: time + 5
                    });
                    time = time + 6
                    if (i === (this.firstPartQuotes.length - 1)) {
                        this.stepEnd = time
                    }
                })
            },
            beeTalks(step) {
                this.boxString = step.sentence;
                this.boxShow = true; 
                this.boxBig = step.big; 
                this.talking = true
            },
            beeQuiets() {
                this.boxString = ''
                this.boxShow = false; 
                this.boxBig = false; 
                this.talking = false; 
                this.sad = false; 
                this.smile = false;
            },
            newInterval() {
                this.interval = setInterval(() => {
                    if (!this.steps[this.currentStep] || this.count > 500) {
                        this.clear();
                        this.smile = true;
                        return;
                    }
                    if (this.count === this.steps[this.currentStep].start) {
                        this.beeTalks(this.steps[this.currentStep]); 
                        this.currentNumber = this.steps[this.currentStep].sentence;
                    }

                    if (this.count === this.steps[this.currentStep].end) {
                        this.beeQuiets(); 
                        this.currentStep++;
                    }

                    this.count++;
                }, 1000)
            },
            clear() {
                clearInterval(this.interval)
            }
        },
        mounted() {
            this.getUserInfo();
            this.generateQuote(this.firstPartQuotes);
            this.newInterval();
        },
        beforeDestroy() {
            this.clear()
        }
    };
</script>
<style scoped lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Comfortaa');

    @keyframes marquee {
        0% {
            transform: translate(0, 0);
        }

        100% {
            transform: translate(-100%, 0);
        }
    }

    .canvas {
        $sky: #76daff;
        $g: #60ad1c;
        $fp: #e91e63;
        $fy: #ffc107;

        font-family: 'Comfortaa', sans-serif;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100vh - 60px);
        background-color: $g;

        .controls {
            position: relative;
            top: 0;
            width: 100%;
            height: 200px;
            display: flex;
            justify-content: center;
            text-align: center;

            @media (min-width: 600px) {
                position: absolute;
                top: 350px;
            }

        }


        .sky {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100vh - 250px);
            background-color: $sky;
            box-shadow: 0 0 0 #000;
            z-index: 0;
        }

        .moving {
            position: absolute;
            width: 100%;
            top: 0px;
            height: 100%;
            overflow: hidden;
            z-index: 0;

        }

        .bushes {
            position: absolute;
            top: calc(100vh - 320px);
            width: 100%;
            display: flex;
            animation: marquee 18s linear infinite;
            padding-left: 100%;

            .obj {
                margin-right: 45%;
            }

            .flower {
                display: inline-block;
                position: relative;
                left: 0px;
                top: 40px;
                background: $fp;
                width: 16px;
                height: 16px;
                position: relative;
                text-align: center;
                transform: rotate(20deg);
                z-index: 1;

                &:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 16px;
                    width: 16px;
                    background: $fp;
                    transform: rotate(135deg);
                    z-index: 1;
                }

                &:after {
                    content: "";
                    position: absolute;
                    top: -20px;
                    left: 10px;
                    height: 60px;
                    width: 60px;
                    border-radius: 50%;
                    background: transparent;
                    box-shadow: 0 3px 0 1px $g;
                    z-index: 0;
                }

                span {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    height: 8px;
                    width: 8px;
                    border-radius: 50%;
                    background: $fy;
                    z-index: 1;
                }
            }

            .bush {
                width: 70px;
                height: 120px;
                left: 20px;
                top: 40px;
                background-color: $g;
                border-radius: 50%;
                display: inline-block;
                position: relative;

                &--2 {
                    transform: scale(.7);
                    top: 30px;
                }

                &:after {
                    content: "";
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    top: -10px;
                    left: -10px;
                    background-color: $g;
                    border-radius: 50%;
                }

                &:before {
                    content: "";
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    top: -20px;
                    left: 25px;
                    background-color: $g;
                    border-radius: 50%;
                }
            }
        }

        .cloud {
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            top: -150px;
            width: 150px;
            left: 10%;
            height: 60px;
            border-radius: 50%;

            &--2 {
                top: -120px;
                left: 70%
            }
        }

        .box {
            position: absolute;
            top: -50px;
            left: 100px;
            background-color: #fff;
            padding: 10px;
            border-radius: 5px 5px 5px 0;
            min-width: 0;
            max-width: 400px;
            min-height: 0;
            font-size: 0;
            opacity: 0;
            transition: all .7s ease-in-out;
            white-space: pre-wrap;

            &.show {
                min-width: 200px;
                min-height: 50px;
                font-size: 14px;
                opacity: 1;
            }

            &.big {
                font-size: 24px;
            }

            &:before {
                position: absolute;
                content: "";
                width: 0;
                height: 0;
                border-left: 0 solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid #fff;
                bottom: -10px;
                left: 0;
            }
        }
    }

    // Bee
    $y: rgb(254, 231, 97);
    $b: rgb(0, 0, 0);

    @keyframes wing-1-beat {
        0% {
            transform: rotate(-24deg) scale(1.1, 1.2);
            top: 2px;
        }

        100% {
            transform: rotate(-53deg);
            top: 4px;
            box-shadow: 1px -1px 0 1px black;
        }
    }

    @keyframes wing-2-beat {
        0% {
            transform: rotate(24deg);
            top: -5px;
        }

        100% {
            transform: rotate(53deg) scale(.8, .8);
            top: 2px;
        }
    }

    @keyframes sting {
        0% {
            transform: rotate(-2deg);
            top: 23px;
        }

        100% {
            transform: rotate(-10deg);
            top: 24px;
        }
    }

    @keyframes body {
        0% {
            top: 32px;
        }

        100% {
            top: 35px;
        }
    }

    @keyframes talking {
        to {
            height: 0;
            top: 16px;
        }
    }

    .bee {
        position: absolute;
        top: 20%;
        width: 100px;
        height: 80px;
        margin: 50px;
        left: 35%;
        z-index: 1;

        @media (min-width: 768px) {
            margin: auto;
        }

        .body {
            top: 35px;
            left: 15px;
            position: relative;
            background-color: $y;
            width: 70px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid $b;
            animation: body .5s linear infinite alternate;
        }

        .line {
            position: absolute;
            top: 1px;
            right: 4px;
            background-color: transparent;
            width: 33px;
            height: 50px;
            border-radius: 50%;
            box-shadow: inset 4px 0px 0px 2px $b;
            transform: rotate(17deg);

            &--2 {
                right: inherit;
                top: -3px;
                left: 11px;
                width: 45px;
                height: 55px;
                transform: rotate(19deg);
                box-shadow: inset 5px 1px 0px 0px $b;
            }
        }

        .sting {
            position: absolute;
            top: 24px;
            left: -24px;
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-right: 24px solid $b;
            border-bottom: 5px solid transparent;
            transform: rotate(-10deg);
            animation: sting .5s cubic-bezier(1.0, 0.6, 0.6, 0.5) infinite alternate;
        }
    }

    .wings {
        position: relative;
        width: 60px;
        height: 40px;
        top: -50px;
        left: 20px;

        .wing {
            position: absolute;
            width: 22px;
            height: 35px;
            top: 2px;
            left: 7px;
            border-radius: 50%;
            box-shadow: 0px -2px 0 1px $b;
            transform: rotate(-53deg);
            animation: wing-1-beat .5s cubic-bezier(1.0, 0.6, 0.6, 0.5) infinite alternate;
        }

        .wing-2 {
            position: absolute;
            width: 22px;
            height: 41px;
            top: -4px;
            left: 37px;
            border-radius: 50%;
            box-shadow: 0px -2px 0 1px $b;
            transform: rotate(53deg);
            animation: wing-2-beat .5s cubic-bezier(1.0, 0.6, 0.6, 0.5) infinite alternate;
        }
    }

    .face {
        position: absolute;
        top: 3rem;
        right: .7rem;
        width: 1.7rem;
        height: 1.7rem;

        .eye1 {
            background-color: $b;
            border-radius: 50%;
            width: .3rem;
            height: .4rem;
            top: 6px;
            left: 5px;
            position: absolute;
        }

        .eye2 {
            background-color: $b;
            border-radius: 50%;
            width: .3rem;
            height: .4rem;
            top: 6px;
            left: 16px;
            position: absolute;
        }

        &--smile {
            .mounth {

                &:before {
                    content: "";
                    position: absolute;
                    width: 12px;
                    height: 2px;
                    top: 9px;
                    right: 0px;
                    background-color: $b;
                    z-index: 1;
                }

                .tooth {
                    position: absolute;
                    width: 10px;
                    height: 5px;
                    top: 10px;
                    right: 1px;
                    background: white;
                    border-bottom-left-radius: 21px;
                    border-bottom-right-radius: 31px;
                }
            }
        }

        &--sad.face {
            right: .8rem;

            .eye1,
            .eye2 {
                width: .5rem;
                height: .5rem;

                &:before {
                    content: "";
                    background-color: white;
                    border-radius: 50%;
                    width: .25rem;
                    height: .25rem;
                    top: 1px;
                    left: 3px;
                    position: absolute;
                }
            }

            .eye2 {
                left: 15px;
            }

            .mounth {
                position: absolute;
                width: 12px;
                height: 1px;
                top: 18px;
                right: 5px;
                border-radius: 50%;
                border: 0;
                box-shadow: 0px 2px 0 0px $b;
                z-index: 1;

                &:before,
                &:after,
                .tooth {
                    display: none;
                }
            }
        }

        .mounth {
            position: absolute;
            width: 12px;
            height: 15px;
            top: 5px;
            right: 8px;
            border-radius: 50%;
            box-shadow: 0px 2px 0 0px $b;
            z-index: 1;
        }

        &--talking {
            .mounth {
                position: absolute;
                width: 11px;
                height: 7px;
                top: 13px;
                right: 7px;
                border-radius: 50%;
                border: 1px solid $b;
                background-color: #fff;
                box-shadow: none;
                animation: talking .7s cubic-bezier(1.0, 0.6, 0.6, 0.5) infinite alternate;

                &:before {
                    content: "";
                    border-radius: 50%;
                    width: 6px;
                    height: 6px;
                    top: -4px;
                    left: 13px;
                    position: absolute;
                    background: rgba(255, 0, 0, 0.1);
                }

                &:after {
                    content: "";
                    border-radius: 50%;
                    width: 6px;
                    height: 5px;
                    top: -3px;
                    left: -8px;
                    position: absolute;
                    background: rgba(255, 0, 0, 0.1);
                }
            }
        }
    }
</style>