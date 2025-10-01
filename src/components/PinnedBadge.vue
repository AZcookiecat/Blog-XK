<template>
  <span class="pinned-badge">
    <i class="fas fa-thumbtack"></i> 置顶
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
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  transform: translateY(-10px);
}
</style>