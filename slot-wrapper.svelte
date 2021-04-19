<script>
  export let slotName;
  export let slotProps;
  export let component;
</script>

{#if typeof component === 'string' && slotName === 'default'}
  {component}
{:else if typeof component === 'string'}
  {(() => {throw new Error('Only default slots can be a string instead of a component')})()}
{:else if slotName === 'default'}
<svelte:component this={component} {...slotProps}></svelte:component>
{:else}
  {(() => {throw new Error('Only default slots are supported for Svelte stories')})()}
{/if}
