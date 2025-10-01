<template>
  <span class="collection-tag" v-if="collection">
    <i class="fas fa-book-open"></i> {{ collection }}
  </span>
</template>

<script>
export default {
  name: 'CollectionTag',
  props: {
    collection: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.collection-tag {
  background-color: #eafaf1;
  color: #2ecc71;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
}

.collection-tag:hover {
  background-color: #2ecc71;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(46, 204, 113, 0.3);
}

/* 深色模式样式 */
.dark .collection-tag {
  background-color: #2d3e32;
  color: #4cd137;
}

.dark .collection-tag:hover {
  background-color: #4cd137;
  color: white;
  box-shadow: 0 2px 4px rgba(76, 209, 55, 0.3);
}
</style>