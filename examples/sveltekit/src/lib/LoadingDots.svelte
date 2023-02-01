<div>
    <span />
    <span />
    <span />
</div>

<style>
    div {
        display: flex;
        padding: 0.25em;
        gap: 0.5em;
    }
    span {
        padding: 0.5em;
        border-radius: 50%;
        background-color: #646464;

        animation-name: blink;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-fill-mode: both;
        margin: 0 2px;
    }

    span:nth-child(2) {
        animation-delay: 0.2s;
    }
    span:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes blink {
        0% {
            opacity: 0.2;
        }
        20% {
            opacity: 1;
        }
        100% {
            opacity: 0.2;
        }
    }
</style>
