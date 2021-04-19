<script>
  export let selected;
  export let stories;
  export let onStory;

  $: storyArray = Object.values(stories).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  function currentIndex() {
    return storyArray.findIndex((story) => selected === story);
  }

  function handleKeydown(event) {
    var index = currentIndex();
    if (index === -1) {
      return;
    }

    if (document.activeElement) {
      if (/^(?:input|select|textarea)$/i.test(document.activeElement.tagName)) {
        return;
      }
    }

    if (event.key === "j") {
      index = (index + 1) % storyArray.length;
    } else if (event.key === "k") {
      index = index - 1;
      if (index < 0) {
        index = storyArray.length + index;
      }
    } else {
      return;
    }

    onStory(storyArray[index]);
  }

  function differentGroup(story1, story2) {
    let story1Sections = story1.name.split(" - ");
    let story2Sections = story2.name.split(" - ");

    if (story1Sections.length === 1 && story2Sections.length === 1) {
      // Neither one is grouped, so we treat them as in the same group
      return false;
    }

    return story1Sections[0] !== story2Sections[0];
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<h1>Stories</h1>
<ul id="sidebar">
  {#each storyArray as story, index}
    {#if index > 0 && storyArray[index - 1] && differentGroup(story, storyArray[index - 1])}
      <li class="group" />
    {/if}
    <li
      class="story"
      class:selected={selected === story}
      on:click={() => onStory(story)}
    >
      {story.name}
    </li>
  {/each}
</ul>
