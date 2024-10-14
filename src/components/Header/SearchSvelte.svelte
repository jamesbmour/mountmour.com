<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let searchQuery = '';
  let inputElement: HTMLInputElement;

  function handleInput() {
    dispatch('input', searchQuery);
  }

  function handleSubmit() {
    dispatch('submit', searchQuery);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  function focusInput() {
    inputElement.focus();
  }
</script>

<div class="relative w-full max-w-md">
  <div class="relative">
    <input
      bind:this={inputElement}
      bind:value={searchQuery}
      on:input={handleInput}
      on:keydown={handleKeydown}
      type="text"
      placeholder="Search..."
      class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded- focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
  </div>
</div>

<svelte:window on:keydown={(e) => {
  if (e.key === '/' && document.activeElement !== inputElement) {
    e.preventDefault();
    focusInput();
  }
}} />
