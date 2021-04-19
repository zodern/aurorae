<script>
  import SlotWrapper from './slot-wrapper.svelte';
  import DefaultWrapper from './default-wrapper.svelte';
  export let component;
  export let props;
  export let wrapper = DefaultWrapper;
  export let slots = Object.create(null);

  $: actualWrapper = wrapper || DefaultWrapper;
  $: noSlots = Object.keys(slots).length === 0;
</script>

<svelte:component this={actualWrapper}>
  {#if noSlots}
    <svelte:component this={component} {...props} />
  {:else}
    <svelte:component this={component} {...props}>
      {#each Object.entries(slots) as [name, { slot, props }]}
        <SlotWrapper component={slot} slotProps={props} slotName={name} />
      {/each}
    </svelte:component>
  {/if}
</svelte:component>
