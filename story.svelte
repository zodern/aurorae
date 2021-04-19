<script>
  import { activeStory } from './svelte-store.js';
  export let name;
</script>

{#if name && $activeStory === name}
  <slot></slot>
{/if}
