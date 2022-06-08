<script>
    import { createEventDispatcher, onDestroy } from 'svelte';

    const dispatch = createEventDispatcher();
    const close = () => dispatch('close');

    let help;

    const handle_keydown = e => {
        if (e.key === 'Escape') {
            close();
            return;
        }

        if (e.key === 'Tab') {
            // trap focus
            const nodes = help.querySelectorAll('*');
            const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

            let index = tabbable.indexOf(document.activeElement);
            if (index === -1 && e.shiftKey) index = 0;

            index += tabbable.length + (e.shiftKey ? -1 : 1);
            index %= tabbable.length;

            tabbable[index].focus();
            e.preventDefault();
        }
    };

    const previously_focused = typeof document !== 'undefined' && document.activeElement;

    if (previously_focused) {
        onDestroy(() => {
            previously_focused.focus();
        });
    }
</script>

<svelte:window on:keydown={handle_keydown}/>

<div class="help-background" on:click={close}></div>

<div class="help" role="dialog" aria-modal="true" bind:this={help}>
    <slot name="header"></slot>
    <hr>
    <slot name="rules"></slot>
    <hr>
    <button  on:click={close}>Закрыть</button>
</div>

<style>
        .help-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }

        .help {
            margin-top: 12%;
            position: absolute;
            left: 50%;
            top: 100px;
            width: 900px;
            max-height: calc(85vh - 5em);
            overflow: auto;
            transform: translate(-50%, -50%);
            background: lemonchiffon;
            z-index: 12;
            border-radius: 6px;
            box-shadow: lemonchiffon 0 0 20px;
        }
        button {
            z-index: 100;
        }
</style>