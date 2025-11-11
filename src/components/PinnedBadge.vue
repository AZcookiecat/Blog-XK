<template>
  <span class="pinned-badge">
    <i class="fas fa-thumbtack"></i>
  </span>
</template>

<script>
export default {
  name: 'PinnedBadge'
}
</script>

<style scoped>
.pinned-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  color: #e74c3c;
  font-size: 1.25rem;
  padding: 0.5rem;
  z-index: 10;
}
</style>