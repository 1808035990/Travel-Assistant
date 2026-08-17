<template>
  <div class="spot-item" v-if="data">
    <div class="spot-name">{{ data.spot || data.name || '待定' }}</div>
    <div class="spot-details" v-if="data.duration || data.ticket || data.transport">
      <div class="detail-row" v-if="data.duration">
        <van-icon name="clock-o" size="14" />
        <span>{{ data.duration }}</span>
      </div>
      <div class="detail-row" v-if="data.ticket">
        <van-icon name="ticket-o" size="14" />
        <span>{{ data.ticket }}</span>
      </div>
      <div class="detail-row" v-if="data.transportation">
        <van-icon name="logistics" size="14" />
        <span>{{ data.transportation }}</span>
      </div>
    </div>
    <div class="spot-desc" v-if="data.description">{{ data.description }}</div>
  </div>

  <div class="spot-item empty" v-else>
    <van-empty description="暂无安排" :image-size="40" />
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.spot-item {
  padding: 12px;
}
.spot-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}
.spot-details {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}
.spot-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
</style>